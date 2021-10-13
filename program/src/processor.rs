use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack},
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};

use arrayref::{array_mut_ref, mut_array_refs};

use crate::{
    instruction::POTInstruction,
    state::{
        Proof, ProofsPage, Signal, SignalsPage, Trader, TradersList, PROOFS_PAGE_SIZE,
        SIGNALS_PAGE_SIZE,
    },
};

pub struct Processor;
impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = POTInstruction::unpack(instruction_data)?;

        match instruction {
            POTInstruction::CreateTrader { email } => {
                Self::process_create_trader(accounts, email, program_id)
            }
            POTInstruction::AddSignal { signal } => {
                Self::process_add_signal(accounts, signal, program_id)
            }
            POTInstruction::AddProof { proof } => {
                Self::process_add_proof(accounts, proof, program_id)
            }
            POTInstruction::ChangeBlockNumberForDemo {
                element_number,
                new_block_number,
            } => Self::process_change_block_number_demo(
                accounts,
                element_number,
                new_block_number,
                program_id,
            ),
            POTInstruction::ChangePricesForDemo {
                element_number,
                new_prices,
            } => Self::process_change_prices_demo(accounts, element_number, new_prices, program_id),
        }
    }

    fn process_create_trader(
        accounts: &[AccountInfo],
        email: [u8; 64],
        program_id: &Pubkey,
    ) -> ProgramResult {
        msg!("Creating trader");

        let accounts_iter = &mut accounts.iter();

        let payer_account = next_account_info(accounts_iter)?;
        let trader_account = next_account_info(accounts_iter)?;
        let traders_list_account = next_account_info(accounts_iter)?;
        let system_account = next_account_info(accounts_iter)?;
        let rent_sysvar = next_account_info(accounts_iter)?;
        let clock_sysvar = next_account_info(accounts_iter)?;

        let (trader_address, trader_bump_seed) =
            Pubkey::find_program_address(&[&payer_account.key.to_bytes(), b"trader"], program_id);

        let trader_signer_seeds: &[&[_]] = &[
            &payer_account.key.to_bytes(),
            b"trader",
            &[trader_bump_seed],
        ];

        if *trader_account.key != trader_address {
            msg!(
                "Error: trader address diviation dismatch: {} vs {}",
                trader_account.key,
                trader_address,
            );
            return Err(ProgramError::IncorrectProgramId);
        }

        if !trader_account.data_is_empty() {
            return Err(ProgramError::AccountAlreadyInitialized);
        }

        let (traders_list_address, traders_list_bump_seed) =
            Pubkey::find_program_address(&[b"traders_list"], program_id);
        msg!("list: {}", traders_list_address);

        if *traders_list_account.key != traders_list_address {
            msg!(
                "Error: traders list address diviation dismatch: {} vs {}",
                traders_list_account.key,
                traders_list_address,
            );
            return Err(ProgramError::IncorrectProgramId);
        }

        let rent = &Rent::from_account_info(rent_sysvar)?;

        msg!("creating trader account");
        msg!("trader account len: {}", trader_account.data_len());

        invoke_signed(
            &system_instruction::create_account(
                payer_account.key,
                trader_account.key,
                1.max(rent.minimum_balance(Trader::LEN)),
                Trader::LEN as u64,
                program_id,
            ),
            &[
                payer_account.clone(),
                trader_account.clone(),
                system_account.clone(),
            ],
            &[&trader_signer_seeds],
        )?;

        msg!("trader account created");
        msg!("trader account len: {}", trader_account.data_len());

        let trader_info = Trader::unpack_unchecked(&trader_account.data.borrow())?;
        if trader_info.is_initialized() {
            return Err(ProgramError::AccountAlreadyInitialized);
        }

        let clock = &Clock::from_account_info(clock_sysvar)?;

        let trader_info = Trader {
            is_initialized: true,
            signals_counter: 0,
            proofs_counter: 0,
            email,
            block_number: clock.slot,
        };
        Trader::pack(trader_info, &mut trader_account.data.borrow_mut())?;

        msg!(
            "traders list account len: {}",
            traders_list_account.data_len()
        );
        if traders_list_account.data_is_empty() {
            let traders_list_signer_seeds: &[&[_]] = &[b"traders_list", &[traders_list_bump_seed]];

            let rent = &Rent::from_account_info(rent_sysvar)?;

            msg!("creating traders list");

            invoke_signed(
                &system_instruction::create_account(
                    payer_account.key,
                    traders_list_account.key,
                    1.max(rent.minimum_balance(SignalsPage::LEN)),
                    TradersList::LEN as u64,
                    program_id,
                ),
                &[
                    payer_account.clone(),
                    traders_list_account.clone(),
                    system_account.clone(),
                ],
                &[&traders_list_signer_seeds],
            )?;

            msg!("traders list created");
            msg!(
                "traders list account len: {}",
                traders_list_account.data_len()
            );
        };

        let mut data = traders_list_account.data.borrow_mut();

        let data = array_mut_ref![data, 0, TradersList::LEN];
        let (counter_data, traders_data) = mut_array_refs![data, 8, 32 * 100];
        let mut counter = u64::from_be_bytes(*counter_data);

        let trader_dst = array_mut_ref![traders_data, (counter * 32) as usize, 32];
        trader_dst.copy_from_slice(&payer_account.key.to_bytes());

        counter += 1;
        counter_data.copy_from_slice(&counter.to_be_bytes());

        Ok(())
    }

    fn process_add_signal(
        accounts: &[AccountInfo],
        signal: Box<Signal>,
        program_id: &Pubkey,
    ) -> ProgramResult {
        let mut signal = signal;
        msg!("Adding signal");

        let accounts_iter = &mut accounts.iter();

        let payer_account = next_account_info(accounts_iter)?;
        let trader_account = next_account_info(accounts_iter)?;
        let signals_page_account = next_account_info(accounts_iter)?;
        let system_account = next_account_info(accounts_iter)?;
        let rent_sysvar = next_account_info(accounts_iter)?;
        let clock_sysvar = next_account_info(accounts_iter)?;
        let pyth_price_info = next_account_info(accounts_iter)?;

        let (trader_address, _) =
            Pubkey::find_program_address(&[&payer_account.key.to_bytes(), b"trader"], program_id);

        if *trader_account.key != trader_address {
            msg!(
                "Error: trader address diviation dismatch: {} vs {}",
                trader_account.key,
                trader_address,
            );
            return Err(ProgramError::IncorrectProgramId);
        }

        let mut trader_info = Trader::unpack(&trader_account.data.borrow())?;
        let page_number = trader_info.signals_counter / SIGNALS_PAGE_SIZE as u64;
        let seed: [&[u8]; 2] = [br"signals_page_", &page_number.to_be_bytes()];
        let seed = seed.concat();

        let (signals_page_address, signals_page_bump_seed) =
            Pubkey::find_program_address(&[&payer_account.key.to_bytes(), &seed], program_id);

        let signals_page_signer_seeds: &[&[_]] = &[
            &payer_account.key.to_bytes(),
            &seed,
            &[signals_page_bump_seed],
        ];

        if *signals_page_account.key != signals_page_address {
            msg!(
                "Error: signals page address diviation dismatch: {} vs {}",
                signals_page_account.key,
                signals_page_address,
            );
            return Err(ProgramError::IncorrectProgramId);
        }

        if trader_info.signals_counter % SIGNALS_PAGE_SIZE as u64 == 0 {
            let rent = &Rent::from_account_info(rent_sysvar)?;

            msg!("creating signals page");

            invoke_signed(
                &system_instruction::create_account(
                    payer_account.key,
                    signals_page_account.key,
                    1.max(rent.minimum_balance(SignalsPage::LEN)),
                    SignalsPage::LEN as u64,
                    program_id,
                ),
                &[
                    payer_account.clone(),
                    signals_page_account.clone(),
                    system_account.clone(),
                ],
                &[&signals_page_signer_seeds],
            )?;

            msg!("signal page created");
        }

        let mut page = SignalsPage::unpack_unchecked(&signals_page_account.data.borrow())?;

        let price = Processor::get_price(pyth_price_info)?;
        signal.prices[0] = price;

        let clock = &Clock::from_account_info(clock_sysvar)?;
        signal.block_number = clock.slot;

        page.signals[trader_info.signals_counter as usize % SIGNALS_PAGE_SIZE] = signal;

        trader_info.signals_counter += 1;

        Trader::pack(trader_info, &mut trader_account.data.borrow_mut())?;
        SignalsPage::pack(page, &mut signals_page_account.data.borrow_mut())
    }

    fn process_add_proof(
        accounts: &[AccountInfo],
        proof: Box<Proof>,
        program_id: &Pubkey,
    ) -> ProgramResult {
        let mut proof = proof;
        msg!("Adding proof");

        let accounts_iter = &mut accounts.iter();

        let payer_account = next_account_info(accounts_iter)?;
        let trader_account = next_account_info(accounts_iter)?;
        let page_account = next_account_info(accounts_iter)?;
        let system_account = next_account_info(accounts_iter)?;
        let rent_sysvar = next_account_info(accounts_iter)?;
        let clock_sysvar = next_account_info(accounts_iter)?;
        let pyth_price_info = next_account_info(accounts_iter)?;

        msg!("proof {:?}", proof.block_number);

        let (trader_address, _) =
            Pubkey::find_program_address(&[&payer_account.key.to_bytes(), b"trader"], program_id);

        if *trader_account.key != trader_address {
            msg!(
                "Error: trader address diviation dismatch: {} vs {}",
                trader_account.key,
                trader_address,
            );
            return Err(ProgramError::IncorrectProgramId);
        }

        let mut trader_info = Trader::unpack(&trader_account.data.borrow())?;
        let page_number = trader_info.proofs_counter / PROOFS_PAGE_SIZE as u64;
        let seed: [&[u8]; 2] = [b"proofs_page_", &page_number.to_be_bytes()];

        let (page_address, page_bump_seed) = Pubkey::find_program_address(
            &[&payer_account.key.to_bytes(), &seed.concat()],
            program_id,
        );

        let page_signer_seeds: &[&[_]] = &[
            &payer_account.key.to_bytes(),
            &seed.concat(),
            &[page_bump_seed],
        ];

        if *page_account.key != page_address {
            msg!(
                "Error: proofs page address diviation dismatch: {} vs {}",
                page_account.key,
                page_address,
            );
            return Err(ProgramError::IncorrectProgramId);
        }

        if trader_info.proofs_counter % PROOFS_PAGE_SIZE as u64 == 0 {
            let rent = &Rent::from_account_info(rent_sysvar)?;

            msg!("creating proofs page");

            invoke_signed(
                &system_instruction::create_account(
                    payer_account.key,
                    page_account.key,
                    1.max(rent.minimum_balance(ProofsPage::LEN)),
                    ProofsPage::LEN as u64,
                    program_id,
                ),
                &[
                    payer_account.clone(),
                    page_account.clone(),
                    system_account.clone(),
                ],
                &[&page_signer_seeds],
            )?;

            msg!("proofs page created");
        }

        let mut page = ProofsPage::unpack_unchecked(&page_account.data.borrow())?;

        let price = Processor::get_price(pyth_price_info)?;

        let diff = f64::abs(price as f64 - proof.prices[0] as f64) / proof.prices[0] as f64;
        msg!("{} {} {}", price, proof.prices[0], diff);
        if diff >= 0.01 {
            return Err(ProgramError::Custom(101));
        }

        let clock = &Clock::from_account_info(clock_sysvar)?;
        proof.block_number = clock.slot;

        page.proofs[trader_info.proofs_counter as usize % PROOFS_PAGE_SIZE] = proof;

        trader_info.proofs_counter += 1;

        Trader::pack(trader_info, &mut trader_account.data.borrow_mut())?;
        ProofsPage::pack(page, &mut page_account.data.borrow_mut())?;
        Ok(())
    }

    fn get_price(pyth_price_info: &AccountInfo) -> Result<u64, ProgramError> {
        let pyth_price_data = &pyth_price_info.try_borrow_data()?;
        let pyth_price = pyth_client::cast::<pyth_client::Price>(pyth_price_data);

        msg!("price {}", pyth_price.agg.price);

        Ok(pyth_price.agg.price as u64)
    }

    fn process_change_block_number_demo(
        accounts: &[AccountInfo],
        element_number: u32,
        new_block_number: u64,
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();

        let _ = next_account_info(accounts_iter)?;
        let target_account = next_account_info(accounts_iter)?;

        match target_account.data_len() {
            Trader::LEN => {
                let mut trader = Trader::unpack_unchecked(&target_account.data.borrow())?;
                trader.block_number = new_block_number;
                Trader::pack(trader, &mut target_account.data.borrow_mut())?;
            }
            SignalsPage::LEN => {
                let mut page = SignalsPage::unpack_unchecked(&target_account.data.borrow())?;
                page.signals[element_number as usize].block_number = new_block_number;
                SignalsPage::pack(page, &mut target_account.data.borrow_mut())?;
            }
            ProofsPage::LEN => {
                let mut page = ProofsPage::unpack_unchecked(&target_account.data.borrow())?;
                page.proofs[element_number as usize].block_number = new_block_number;
                ProofsPage::pack(page, &mut target_account.data.borrow_mut())?;
            }
            _ => {}
        };

        Ok(())
    }

    fn process_change_prices_demo(
        accounts: &[AccountInfo],
        element_number: u32,
        new_prices: [u64; 10],
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();

        let _ = next_account_info(accounts_iter)?;
        let target_account = next_account_info(accounts_iter)?;

        match target_account.data_len() {
            SignalsPage::LEN => {
                let mut page = SignalsPage::unpack_unchecked(&target_account.data.borrow())?;
                page.signals[element_number as usize].prices = new_prices;
                SignalsPage::pack(page, &mut target_account.data.borrow_mut())?;
            }
            ProofsPage::LEN => {
                let mut page = ProofsPage::unpack_unchecked(&target_account.data.borrow())?;
                page.proofs[element_number as usize].prices = new_prices;
                ProofsPage::pack(page, &mut target_account.data.borrow_mut())?;
            }
            _ => {}
        };

        Ok(())
    }
}
