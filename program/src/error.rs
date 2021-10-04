use thiserror::Error;

use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum POTErrors {
    /// Invalid instruction
    #[error("Invalid Instruction")]
    InvalidInstruction,
}

impl From<POTErrors> for ProgramError {
    fn from(e: POTErrors) -> Self {
        ProgramError::Custom(e as u32)
    }
}
