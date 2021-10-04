use std::convert::TryInto;

use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
};

use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};

#[derive(Debug)]
pub struct Trader {
    pub is_initialized: bool,
    pub email: [u8; 64],
    pub signals_counter: u64,
    pub proofs_counter: u64,
}

#[derive(Debug)]
pub struct TradersList {
    pub counter: u64,
    pub traders: [u8; 32 * 100],
}

#[derive(Debug)]
pub struct Signal {
    pub is_initialized: bool,
    pub block_number: u64,
    pub hash: [u8; 32],
    // pub prices: [u64; 10], // TODO
}

#[derive(Debug)]
pub struct Proof {
    pub is_initialized: bool,
    pub pi_a: [[u8; 32]; 2],
    pub pi_b: [[[u8; 32]; 2]; 2],
    pub pi_c: [[u8; 32]; 2],
    pub pnl: u32,
    pub block_number: u64,
    pub new_balance_hash: [u8; 32],
}

pub const SIGNALS_PAGE_SIZE: usize = 2;

#[derive(Debug)]
pub struct SignalsPage {
    pub signals: [Signal; SIGNALS_PAGE_SIZE],
}

pub const PROOFS_PAGE_SIZE: usize = 2;

#[derive(Debug)]
pub struct ProofsPage {
    pub proofs: [Proof; PROOFS_PAGE_SIZE],
}

impl Sealed for Trader {}

impl IsInitialized for Trader {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for Trader {
    const LEN: usize = 81;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, Trader::LEN];
        let (is_initialized, email, signals_counter, proofs_counter) =
            array_refs![src, 1, 64, 8, 8];
        let is_initialized = match is_initialized {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };

        let signals_counter = u64::from_be_bytes(*signals_counter);
        let proofs_counter = u64::from_be_bytes(*proofs_counter);

        Ok(Trader {
            is_initialized,
            email: *email,
            signals_counter,
            proofs_counter,
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, Trader::LEN];
        let (is_initialized_dst, email_dst, signals_counter_dst, proofs_counter_dst) =
            mut_array_refs![dst, 1, 64, 8, 8];

        let Trader {
            is_initialized,
            email,
            signals_counter,
            proofs_counter,
        } = self;

        is_initialized_dst[0] = *is_initialized as u8;

        email_dst.copy_from_slice(email);
        signals_counter_dst.copy_from_slice(&signals_counter.to_be_bytes());
        proofs_counter_dst.copy_from_slice(&proofs_counter.to_be_bytes());
    }
}

impl Sealed for TradersList {}

impl Pack for TradersList {
    const LEN: usize = 8 + 32 * 100;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, TradersList::LEN];
        let (counter, traders) = array_refs![src, 8, 32 * 100];

        let counter = u64::from_be_bytes(*counter);

        Ok(TradersList {
            counter,
            traders: *traders,
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, TradersList::LEN];
        let (counter_dst, pubkeys_dst) = mut_array_refs![dst, 8, 32 * 100];
        counter_dst.copy_from_slice(&self.counter.to_be_bytes());

        pubkeys_dst.copy_from_slice(&self.traders);
    }
}

impl Sealed for Signal {}

impl IsInitialized for Signal {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for Signal {
    const LEN: usize = 41;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, Signal::LEN];
        let (is_initialized, block_number, hash) = array_refs![src, 1, 8, 32];
        let is_initialized = match is_initialized {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };

        let block_number = u64::from_be_bytes(*block_number);

        Ok(Signal {
            is_initialized,
            block_number,
            hash: *hash,
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, Signal::LEN];
        let (is_initialized_dst, block_number_dst, hash_dst) = mut_array_refs![dst, 1, 8, 32];

        let Signal {
            is_initialized,
            block_number,
            hash,
        } = self;

        is_initialized_dst[0] = *is_initialized as u8;

        block_number_dst.copy_from_slice(&block_number.to_be_bytes());
        hash_dst.copy_from_slice(hash);
    }
}

impl Sealed for Proof {}

impl IsInitialized for Proof {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for Proof {
    const LEN: usize = 301;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, Proof::LEN];
        let (
            is_initialized,
            pi_a_0,
            pi_a_1,
            pi_b_0_0,
            pi_b_0_1,
            pi_b_1_0,
            pi_b_1_1,
            pi_c_0,
            pi_c_1,
            pnl,
            block_number,
            new_balance_hash,
        ) = array_refs![src, 1, 32, 32, 32, 32, 32, 32, 32, 32, 4, 8, 32];
        let is_initialized = match is_initialized {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };

        let pnl = u32::from_be_bytes(*pnl);
        let block_number = u64::from_be_bytes(*block_number);

        Ok(Proof {
            is_initialized,
            pi_a: [*pi_a_0, *pi_a_1],
            pi_b: [[*pi_b_0_0, *pi_b_0_1], [*pi_b_1_0, *pi_b_1_1]],
            pi_c: [*pi_c_0, *pi_c_1],
            pnl,
            block_number,
            new_balance_hash: *new_balance_hash,
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, Proof::LEN];
        let (
            is_initialized_dst,
            pi_a_0_dst,
            pi_a_1_dst,
            pi_b_0_0_dst,
            pi_b_0_1_dst,
            pi_b_1_0_dst,
            pi_b_1_1_dst,
            pi_c_0_dst,
            pi_c_1_dst,
            pnl_dst,
            block_number_dst,
            new_balance_hash_dst,
        ) = mut_array_refs![dst, 1, 32, 32, 32, 32, 32, 32, 32, 32, 4, 8, 32];

        let Proof {
            is_initialized,
            pi_a,
            pi_b,
            pi_c,
            pnl,
            block_number,
            new_balance_hash,
        } = self;

        is_initialized_dst[0] = *is_initialized as u8;

        pi_a_0_dst.copy_from_slice(&pi_a[0]);
        pi_a_1_dst.copy_from_slice(&pi_a[1]);

        pi_b_0_0_dst.copy_from_slice(&pi_b[0][0]);
        pi_b_0_1_dst.copy_from_slice(&pi_b[0][1]);
        pi_b_1_0_dst.copy_from_slice(&pi_b[1][0]);
        pi_b_1_1_dst.copy_from_slice(&pi_b[1][1]);

        pi_c_0_dst.copy_from_slice(&pi_c[0]);
        pi_c_1_dst.copy_from_slice(&pi_c[1]);

        pnl_dst.copy_from_slice(&pnl.to_be_bytes());
        block_number_dst.copy_from_slice(&block_number.to_be_bytes());

        new_balance_hash_dst.copy_from_slice(new_balance_hash);
    }
}

impl Sealed for SignalsPage {}

impl Pack for SignalsPage {
    const LEN: usize = Signal::LEN * SIGNALS_PAGE_SIZE;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let signals: [Signal; SIGNALS_PAGE_SIZE] = (0..SIGNALS_PAGE_SIZE)
            .into_iter()
            .filter_map(|i| {
                Signal::unpack_unchecked(array_ref![src, i * Signal::LEN, Signal::LEN])
                    .map_err(|_| ProgramError::InvalidAccountData)
                    .ok()
            })
            .collect::<Vec<Signal>>()
            .try_into()
            .map_err(|_| ProgramError::InvalidAccountData)?;

        Ok(SignalsPage { signals })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        for (i, signal) in self.signals.iter().enumerate() {
            let dst = array_mut_ref![dst, i * Signal::LEN, Signal::LEN];
            signal.pack_into_slice(dst);
        }
    }
}

impl Sealed for ProofsPage {}

impl Pack for ProofsPage {
    const LEN: usize = Proof::LEN * PROOFS_PAGE_SIZE;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let proofs: [Proof; PROOFS_PAGE_SIZE] = (0..PROOFS_PAGE_SIZE)
            .into_iter()
            .filter_map(|i| {
                Proof::unpack_unchecked(array_ref![src, i * Proof::LEN, Proof::LEN])
                    .map_err(|_| ProgramError::InvalidAccountData)
                    .ok()
            })
            .collect::<Vec<Proof>>()
            .try_into()
            .map_err(|_| ProgramError::InvalidAccountData)?;

        Ok(ProofsPage { proofs })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        for (i, proof) in self.proofs.iter().enumerate() {
            let dst = array_mut_ref![dst, i * Proof::LEN, Proof::LEN];
            proof.pack_into_slice(dst);
        }
    }
}
