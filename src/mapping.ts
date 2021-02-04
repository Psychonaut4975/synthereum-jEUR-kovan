
/////
import {
  Contract,
  AddDerivative,
  Exchange,
  Mint,
  Redeem,
  RemoveDerivative,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  SetFeePercentage,
  SetFeeRecipients,
  Settlement
} from "../generated/Contract/Contract"

import {
  Transfer
} from "../generated/USDC-Contract/Contract";


//ENTITIES
import {
  Mint as MintEntity, 
  Redeem as RedeemEntity,
  Exchange as ExchangeEntity,
  PoolDeposit as PoolDepositEntity
} from "../generated/schema"


//UTILS
import {ethereum, BigDecimal, BigInt, Value, Address} from "@graphprotocol/graph-ts"


const JEUR_CONTRACT_ADDRESS = Address.fromHexString("f8be24f14D5FD3395eB3b33b27e1606271CE8242");
const USDC_CONTRACT_DECIMAL_MULTIPLIER = 10 ** -6;
const JEUR_DECIMAL_MULTIPLIER = 10 ** -18;


export function handleAddDerivative (event: AddDerivative): void {
  // // Entities can be loaded from the store using a string ID; this ID
  // // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())

  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new ExampleEntity(event.transaction.from.toHex())

  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }

  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)

  // // Entity fields can be set based on event parameters
  // entity.pool = event.params.pool
  // entity.derivative = event.params.derivative

  // // Entities can be written to the store with `.save()`
  // entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DEFAULT_ADMIN_ROLE(...)
  // - contract.DOMAIN_SEPARATOR(...)
  // - contract.EXCHANGE_TYPEHASH(...)
  // - contract.LIQUIDITY_PROVIDER_ROLE(...)
  // - contract.MAINTAINER_ROLE(...)
  // - contract.MINT_TYPEHASH(...)
  // - contract.REDEEM_TYPEHASH(...)
  // - contract.VALIDATOR_ROLE(...)
  // - contract.getRoleAdmin(...)
  // - contract.getRoleMember(...)
  // - contract.getRoleMemberCount(...)
  // - contract.hasRole(...)
  // - contract.mint(...)
  // - contract.redeem(...)
  // - contract.exchange(...)
  // - contract.slowWithdrawPassedRequest(...)
  // - contract.fastWithdraw(...)
  // - contract.settleEmergencyShutdown(...)
  // - contract.synthereumFinder(...)
  // - contract.version(...)
  // - contract.collateralToken(...)
  // - contract.syntheticToken(...)
  // - contract.getAllDerivatives(...)
  // - contract.isDerivativeAdmitted(...)
  // - contract.getStartingCollateralization(...)
  // - contract.syntheticTokenSymbol(...)
  // - contract.isContractAllowed(...)
  // - contract.getFeeInfo(...)
  // - contract.getUserNonce(...)
  // - contract.calculateFee(...)
}


type EventParam = ethereum.EventParam;

function usdc_decimal_value(value: BigInt): BigDecimal {
  //simpler conversion ?
  return value.toBigDecimal().times(BigDecimal.fromString(USDC_CONTRACT_DECIMAL_MULTIPLIER.toString()));
}

function jeur_decimal_value(value: BigInt): BigDecimal {
  //simpler conversion ?
  return value.toBigDecimal().times(BigDecimal.fromString(JEUR_DECIMAL_MULTIPLIER.toString()));
}

export function handleExchange(event: Exchange): void {
  let exchange = new ExchangeEntity(event.transaction.hash.toHex()); //change id ?
  
  exchange.address = event.params.account;
  exchange.destNumTokensReceived = event.params.destNumTokensReceived;
  exchange.destPool = event.params.destPool;
  exchange.feePaid = usdc_decimal_value(event.params.feePaid);
  exchange.numTokensSent = jeur_decimal_value(event.params.numTokensSent);
  exchange.sourcePool = event.params.sourcePool;
  exchange.timestamp = event.block.timestamp;
  
  exchange.save();
}

export function handleMint(event: Mint): void {
  let mint = new MintEntity(event.transaction.hash.toHex()); //change id ?

  mint.pool = event.params.pool;
  mint.address = event.params.account;
  mint.collateralSent = usdc_decimal_value(event.params.collateralSent);
  mint.feePaid = usdc_decimal_value(event.params.feePaid);
  mint.numTokensReceived = jeur_decimal_value(event.params.numTokensReceived);
  mint.timestamp = event.block.timestamp;
  
  mint.save();
}


export function handleRedeem(event: Redeem): void {
  let redeem = new RedeemEntity(event.transaction.hash.toHex()); //change id ?

  redeem.address = event.params.account;
  redeem.pool = event.params.pool;
  redeem.collateralReceived = usdc_decimal_value(event.params.collateralReceived);
  redeem.feePaid = usdc_decimal_value(event.params.feePaid);
  redeem.numTokensSent = jeur_decimal_value(event.params.numTokensSent);
  redeem.timestamp = event.block.timestamp;

  redeem.save();
}

export function handleRemoveDerivative(event: RemoveDerivative): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleSetFeePercentage(event: SetFeePercentage): void {}

export function handleSetFeeRecipients(event: SetFeeRecipients): void {}

export function handleSettlement(event: Settlement): void {
  
}



//USDC CONTRACT 

export function handleUSDC_Transfer(event: Transfer): void {
  var from = event.params.from;
  var to = event.params.to;
  if(to.equals(JEUR_CONTRACT_ADDRESS)){
    var pool_deposit = new PoolDepositEntity(event.transaction.hash.toHex());
    pool_deposit.address = from;
    pool_deposit.amount = usdc_decimal_value(event.params.value);
    pool_deposit.timestamp = event.block.timestamp;
    
    pool_deposit.save();
  }

}

