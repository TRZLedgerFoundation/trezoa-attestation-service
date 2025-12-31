#![no_std]

pub mod constants;
pub mod error;
pub mod events;
#[cfg(feature = "idl")]
pub mod instructions;
pub mod macros;
pub mod processor;
pub mod state;

#[cfg(not(feature = "no-entrypoint"))]
pub mod entrypoint;

pinocchio_pubkey::declare_id!("8AVGA5ygh9XXLYLdnZRc2M5oEPyRLx7zdfjR57XHuFBL");
