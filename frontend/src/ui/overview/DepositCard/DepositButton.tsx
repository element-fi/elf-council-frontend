import React, { ReactElement } from "react";
import { Tooltip } from "@material-ui/core";
import { FixedNumber } from "ethers";
import tw from "src/elf-tailwindcss-classnames";
import Button from "src/ui/base/Button/Button";
import { t } from "ttag";

interface DepositButtonProps {
  account: string | null | undefined;
  allowance: string;
  balance: string;
  depositAmount: string;
  onDeposit: () => void;
}
export function DepositButton(props: DepositButtonProps): ReactElement {
  const { allowance, account, balance, depositAmount, onDeposit } = props;
  const hasDepositAmount = !!Number(depositAmount);
  const hasAllowance = !!Number(allowance);
  const hasAnyBalance = !!Number(balance);
  const hasEnoughBalance = !FixedNumber.from(balance || "0")
    .subUnsafe(FixedNumber.from(depositAmount || "0"))
    .isNegative();

  const tooltipTitle = getTooltipTitle(
    account,
    hasAllowance,
    hasAnyBalance,
    hasDepositAmount,
    hasEnoughBalance
  );

  return (
    <Tooltip
      id="deposit-button-tooltp"
      arrow
      title={tooltipTitle}
      placement="top"
    >
      <div>
        <Button
          error={!hasEnoughBalance}
          disabled={
            !hasEnoughBalance || !hasAllowance || !account || !hasDepositAmount
          }
          className={tw("w-full")}
          onClick={onDeposit}
        >
          <span className={tw("w-full")}>{t`Deposit`}</span>
        </Button>
      </div>
    </Tooltip>
  );
}
function getTooltipTitle(
  account: string | null | undefined,
  hasAllowance: boolean,
  hasAnyBalance: boolean,
  hasDepositAmount: boolean,
  hasEnoughBalance: boolean
): string {
  if (!account) {
    return t`Connect wallet`;
  }

  if (!hasAllowance) {
    return t`Need allowance`;
  }

  if (!hasAnyBalance) {
    return t`No tokens to deposit`;
  }

  if (!hasDepositAmount) {
    return t`Enter a deposit amount`;
  }

  if (!hasEnoughBalance) {
    return t`Not enough tokens`;
  }

  return "";
}
