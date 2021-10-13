use solana_program::{program_error::ProgramError, program_pack::Pack};
use std::convert::TryInto;

use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};

use crate::error::POTErrors::InvalidInstruction;
use crate::state::{Proof, Signal};

#[derive(Debug)]
pub enum POTInstruction {
    /// Create new trader
    ///
    ///
    /// Accounts expected:
    ///
    /// 0. `[signer]` Creator of the trader
    /// 1. `[writable]` Account for trader info
    /// 2. `[writable]` Traders List account
    /// 3. `[] System program`
    /// 4. `[] Rent sysvar`
    CreateTrader { email: [u8; 64] },

    /// Add new signal
    ///
    ///
    /// Accounts expected:
    ///
    /// 0. `[signer]` Creator of the trader
    /// 1. `[writable]` Account for trader info
    /// 2. `[writable]` Signals page account
    /// 3. `[] System program`
    /// 4. `[] Rent sysvar`
    AddSignal { signal: Box<Signal> },

    /// Add new proof
    ///
    ///
    /// Accounts expected:
    ///
    /// 0. `[signer]` Creator of the trader
    /// 1. `[writable]` Account for trader info
    /// 2. `[writable]` Proofs page account
    /// 3. `[] System program`
    /// 4. `[] Rent sysvar`
    AddProof { proof: Box<Proof> },

    ChangeBlockNumberForDemo {
        element_number: u32,
        new_block_number: u64,
    },

    ChangePricesForDemo {
        element_number: u32,
        new_prices: [u64; 10],
    },
}

impl POTInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            0 => {
                let email: [u8; 64] = rest.try_into().ok().ok_or(InvalidInstruction)?;
                Self::CreateTrader { email }
            }
            1 => {
                let signal = Signal::unpack(rest)?;
                Self::AddSignal {
                    signal: Box::new(signal),
                }
            }
            2 => {
                let proof = Proof::unpack(rest)?;
                Self::AddProof {
                    proof: Box::new(proof),
                }
            }
            254 => {
                let src = array_ref![rest, 0, 4 + 8];
                let (element_number, new_block_number) = array_refs![src, 4, 8];

                let element_number = u32::from_be_bytes(*element_number);
                let new_block_number = u64::from_be_bytes(*new_block_number);

                Self::ChangeBlockNumberForDemo {
                    element_number,
                    new_block_number,
                }
            }
            255 => {
                let src = array_ref![rest, 0, 4 + 8 * 10];
                let (element_number, new_prices) = array_refs![src, 4, 8 * 10];

                let element_number = u32::from_be_bytes(*element_number);

                let new_prices: [u64; 10] = (0..10)
                    .map(|i| u64::from_be_bytes(*array_ref![new_prices, i * 8, 8]))
                    .collect::<Vec<u64>>()
                    .try_into()
                    .map_err(|_| ProgramError::InvalidAccountData)?;

                Self::ChangePricesForDemo {
                    element_number,
                    new_prices,
                }
            }
            _ => return Err(InvalidInstruction.into()),
        })
    }

    pub fn pack(&self, dst: &mut [u8]) {
        match self {
            &Self::CreateTrader { email } => {
                let dst = array_mut_ref![dst, 0, 1 + 64];
                let (method_dst, email_dst) = mut_array_refs![dst, 1, 64];
                method_dst[0] = 0;
                email_dst.copy_from_slice(&email);
            }
            Self::AddSignal { signal } => {
                let dst = array_mut_ref![dst, 0, 1 + Signal::LEN];
                let (method_dst, signal_dst) = mut_array_refs![dst, 1, Signal::LEN];
                method_dst[0] = 1;
                signal.pack_into_slice(signal_dst);
            }
            Self::AddProof { proof } => {
                let dst = array_mut_ref![dst, 0, 1 + Proof::LEN];
                let (method_dst, proof_dst) = mut_array_refs![dst, 1, Proof::LEN];
                method_dst[0] = 2;
                proof.pack_into_slice(proof_dst);
            }
            _ => {}
        }
    }
}
