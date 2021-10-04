use solana_program::{
    system_program,
    sysvar,
};
use solana_program_test::*;
use solana_sdk::{
    account::ReadableAccount,
    hash::Hash,
    instruction::{AccountMeta, Instruction},
    program_pack::Pack,
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    transaction::Transaction,
};

use solana_proof_of_trade::{instruction::POTInstruction, state::{PROOFS_PAGE_SIZE, Proof, ProofsPage, SIGNALS_PAGE_SIZE, Signal, SignalsPage, Trader}};

fn traders_list_pda(program_id: Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[b"traders_list"], &program_id).0
}

fn trader_pda(payer: Pubkey, program_id: Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[&payer.to_bytes(), b"trader"], &program_id).0
}

fn trader_signals_page(payer: Pubkey, program_id: Pubkey, page_number: u64) -> Pubkey {
    let seed: [&[u8]; 2] = [b"signals_page_", &page_number.to_be_bytes()];

    Pubkey::find_program_address(&[&payer.to_bytes(), &seed.concat()], &program_id).0
}

fn trader_proofs_page(payer: Pubkey, program_id: Pubkey, page_number: u64) -> Pubkey {
    let seed: [&[u8]; 2] = [b"proofs_page_", &page_number.to_be_bytes()];

    Pubkey::find_program_address(&[&payer.to_bytes(), &seed.concat()], &program_id).0
}

#[tokio::test]
async fn test_pot() {
    let program_id = Pubkey::new_unique();
    println!("ProgramID: {:?}", program_id);

    let program_test = ProgramTest::new(
        "solana_proof_of_trade",
        program_id,
        processor!(solana_proof_of_trade::entrypoint::process_instruction),
    );

    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    create_trader(program_id, &mut banks_client, &payer, recent_blockhash).await;

    add_signals(program_id, &mut banks_client, &payer, recent_blockhash).await;

    add_proofs(program_id, &mut banks_client, &payer, recent_blockhash).await;
}

async fn create_trader(
    program_id: Pubkey,
    banks_client: &mut BanksClient,
    payer: &Keypair,
    recent_blockhash: Hash,
) {
    let trader_address = trader_pda(payer.pubkey(), program_id);
    let traders_list_address = traders_list_pda(program_id);

    let trader_account = banks_client.get_account(trader_address).await.unwrap();
    assert_eq!(trader_account, None,);

    let email = [1; 64];
    let create_trader = POTInstruction::CreateTrader { email };
    let mut create_trader_data = [0; 65];
    create_trader.pack(&mut create_trader_data);

    let mut transaction = Transaction::new_with_payer(
        &[Instruction::new_with_bytes(
            program_id,
            &create_trader_data,
            vec![
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new(trader_address, false),
                AccountMeta::new(traders_list_address, false),
                AccountMeta::new_readonly(system_program::ID, false),
                AccountMeta::new_readonly(sysvar::rent::ID, false),
            ],
        )],
        Some(&payer.pubkey()),
    );
    transaction.sign(&[payer], recent_blockhash);
    banks_client.process_transaction(transaction).await.unwrap();

    let traders_list_account = banks_client
        .get_account(traders_list_address)
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        traders_list_account.data()[8..40],
        trader_address.to_bytes()
    );

    let trader_account = banks_client
        .get_account(trader_address)
        .await
        .unwrap()
        .unwrap();
    assert_eq!(Trader::unpack(&trader_account.data).unwrap().email, email);
}

async fn add_signals(
    program_id: Pubkey,
    banks_client: &mut BanksClient,
    payer: &Keypair,
    recent_blockhash: Hash,
) {
    let trader_address = trader_pda(payer.pubkey(), program_id);

    let trader_account = banks_client
        .get_account(trader_address)
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        Trader::unpack(&trader_account.data)
            .unwrap()
            .signals_counter,
        0
    );

    for i in 0..25 {
        let trader_account = banks_client
            .get_account(trader_address)
            .await
            .unwrap()
            .unwrap();

        let trader_info = Trader::unpack(&trader_account.data()).unwrap();
        let page_number: u64 = trader_info.signals_counter / SIGNALS_PAGE_SIZE as u64;
        let page_address = trader_signals_page(payer.pubkey(), program_id, page_number);

        let signal = Signal {
            is_initialized: true,
            hash: [i + 1; 32],
            block_number: 5,
        };

        let add_signal_instruction =
            solana_proof_of_trade::instruction::POTInstruction::AddSignal { signal };
        let mut add_signal_data = [0; 1 + Signal::LEN];
        add_signal_instruction.pack(&mut add_signal_data);

        let mut transaction = Transaction::new_with_payer(
            &[Instruction::new_with_bytes(
                program_id,
                &add_signal_data,
                vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(trader_address, false),
                    AccountMeta::new(page_address, false),
                    AccountMeta::new_readonly(system_program::ID, false),
                    AccountMeta::new_readonly(sysvar::rent::ID, false),
                ],
            )],
            Some(&payer.pubkey()),
        );
        transaction.sign(&[payer], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        let trader_account = banks_client
            .get_account(trader_address)
            .await
            .unwrap()
            .unwrap();

        assert_eq!(
            Trader::unpack(&trader_account.data)
                .unwrap()
                .signals_counter,
            trader_info.signals_counter + 1,
        );
    }

    let trader_account = banks_client
        .get_account(trader_address)
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        Trader::unpack(&trader_account.data)
            .unwrap()
            .signals_counter,
        25,
    );

    for page_number in 0..=2u64 {
        let page_address = trader_signals_page(payer.pubkey(), program_id, page_number);

        let signals_page_account = banks_client
            .get_account(page_address)
            .await
            .unwrap()
            .unwrap();

        let signals_page_data = SignalsPage::unpack_unchecked(signals_page_account.data()).unwrap();
        for (i, signal) in signals_page_data.signals.iter().enumerate() {
            if page_number < 2 || i < 5 {
                assert_ne!(signal.hash, [0u8; 32]);
            }
        }
    }
}

async fn add_proofs(
    program_id: Pubkey,
    banks_client: &mut BanksClient,
    payer: &Keypair,
    recent_blockhash: Hash,
) {
    let trader_address = trader_pda(payer.pubkey(), program_id);

    let trader_account = banks_client
        .get_account(trader_address)
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        Trader::unpack(&trader_account.data).unwrap().proofs_counter,
        0
    );

    let proofs_count = (PROOFS_PAGE_SIZE as f64 * 2.5) as u64;

    for i in 0..proofs_count {
        let trader_account = banks_client
            .get_account(trader_address)
            .await
            .unwrap()
            .unwrap();

        let trader_info = Trader::unpack(&trader_account.data()).unwrap();
        let page_number: u64 = trader_info.proofs_counter / PROOFS_PAGE_SIZE as u64;
        let page_address = trader_proofs_page(payer.pubkey(), program_id, page_number);

        let proof = Proof {
            is_initialized: true,
            pi_a: [[1u8; 32], [2u8; 32]],
            pi_b: [[[3u8; 32], [4u8; 32]], [[5u8; 32], [6u8; 32]]],
            pi_c: [[7u8; 32], [8u8; 32]],
            pnl: 123,
            block_number: i,
            new_balance_hash: [9u8; 32],
        };

        let add_proof_instruction =
            solana_proof_of_trade::instruction::POTInstruction::AddProof { proof };
        let mut add_proof_data = [0; 1 + Proof::LEN];
        add_proof_instruction.pack(&mut add_proof_data);

        let mut transaction = Transaction::new_with_payer(
            &[Instruction::new_with_bytes(
                program_id,
                &add_proof_data,
                vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(trader_address, false),
                    AccountMeta::new(page_address, false),
                    AccountMeta::new_readonly(system_program::ID, false),
                    AccountMeta::new_readonly(sysvar::rent::ID, false),
                ],
            )],
            Some(&payer.pubkey()),
        );
        transaction.sign(&[payer], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        let trader_account = banks_client
            .get_account(trader_address)
            .await
            .unwrap()
            .unwrap();

        assert_eq!(
            Trader::unpack(&trader_account.data).unwrap().proofs_counter,
            trader_info.proofs_counter + 1,
        );
    }

    let trader_account = banks_client
        .get_account(trader_address)
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        Trader::unpack(&trader_account.data).unwrap().proofs_counter,
        proofs_count,
    );

    for page_number in 0..=2u64 {
        let page_address = trader_proofs_page(payer.pubkey(), program_id, page_number);

        let proofs_page_account = banks_client
            .get_account(page_address)
            .await
            .unwrap()
            .unwrap();

        let proofs_page_data = ProofsPage::unpack_unchecked(proofs_page_account.data()).unwrap();
        for (i, proof) in proofs_page_data.proofs.iter().enumerate() {
            if page_number < 2 || i < PROOFS_PAGE_SIZE / 2 {
                assert_ne!(proof.new_balance_hash, [0u8; 32]);
            }
        }
    }
}
