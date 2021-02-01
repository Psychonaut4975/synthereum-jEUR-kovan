import { BigInt } from "@graphprotocol/graph-ts"
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
import { ExampleEntity } from "../generated/schema"

export function handleAddDerivative(event: AddDerivative): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.pool = event.params.pool
  entity.derivative = event.params.derivative

  // Entities can be written to the store with `.save()`
  entity.save()

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

export function handleExchange(event: Exchange): void {}

export function handleMint(event: Mint): void {}

export function handleRedeem(event: Redeem): void {}

export function handleRemoveDerivative(event: RemoveDerivative): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleSetFeePercentage(event: SetFeePercentage): void {}

export function handleSetFeeRecipients(event: SetFeeRecipients): void {}

export function handleSettlement(event: Settlement): void {}
