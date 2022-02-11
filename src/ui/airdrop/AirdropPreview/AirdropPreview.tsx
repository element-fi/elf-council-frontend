import { CheckCircleIcon } from "@heroicons/react/solid";
import React, { ReactElement } from "react";
import { useMerkleInfo } from "src/elf/merkle/useMerkleInfo";
import { LoadingAirdropCard } from "src/ui/airdrop/AirdropPage/LoadingAirdropCard";
import { NoAirdropCard } from "src/ui/airdrop/AirdropPage/NoAirdropCard";
import { AirdropAmountCard } from "src/ui/airdrop/AirdropPreview/AirdropAmountCard";
import { StepCard } from "src/ui/airdrop/StepCard/StepCard";
import { ElementIcon, IconSize } from "src/ui/base/ElementIcon/ElementIcon";
import { Tag } from "src/ui/base/Tag/Tag";
import { Intent } from "src/ui/base/Intent";
import { jt, t } from "ttag";

interface AirdropPreviewProps {
  account: string | null | undefined;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const elementIconInBodyText = (
  <ElementIcon
    key="element-icon-in-body-text"
    className="ml-0.5 mr-1 -mb-1.5 inline-block bg-paleLily"
    size={IconSize.MEDIUM}
  />
);
export function AirdropPreview({
  onNextStep,
  onPrevStep,
  account,
}: AirdropPreviewProps): ReactElement {
  const merkleInfoQueryData = useMerkleInfo(account);

  const { data: merkleInfo, isLoading: isLoadingMerkle } = merkleInfoQueryData;

  if (isLoadingMerkle && !merkleInfo) {
    return <LoadingAirdropCard />;
  }

  // user has no airdrop if they have no merkle value
  if (!merkleInfo) {
    return <NoAirdropCard />;
  }

  return (
    <StepCard onPrevStep={onPrevStep} onNextStep={onNextStep}>
      <div className="flex flex-col">
        <div className="mb-4 text-right md:mb-0">
          <Tag intent={Intent.SUCCESS}>
            <span className="font-bold">{t`Eligible for airdrop`}</span>
            <CheckCircleIcon height={24} className="ml-4" />
          </Tag>
        </div>
        <div className="mb-2 flex items-center justify-center text-3xl font-bold">
          <span className="text-center">{t`Congratulations!`}</span>
        </div>
        <div className="mb-10 flex w-full flex-col items-center justify-center text-center text-base">
          <span className="mb-6 w-full font-bold ">{jt`You have some ${elementIconInBodyText}ELFI to deposit.`}</span>
          <span className="w-3/4 text-justify">{t`You've earned this voting power
          for being an active member of the Element community. We hope to see
          you continue to contribute to the future of Element. Use or delegate
          your voting power wisely!`}</span>
        </div>
        <div className="mb-8 flex flex-col justify-center space-y-10 px-12 md:flex-row md:space-x-10 md:space-y-0">
          <AirdropAmountCard account={account} />
        </div>
      </div>
    </StepCard>
  );
}
