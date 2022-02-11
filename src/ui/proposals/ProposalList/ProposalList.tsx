import React, { ReactElement } from "react";

import { Signer } from "@ethersproject/abstract-signer";
import { Proposal } from "elf-council-proposals";
import { ProposalListItem } from "./ProposalListItem";

interface ProposalListProps {
  account: string | null | undefined;
  signer: Signer | undefined;
  proposals: Proposal[];
  activeProposalId: string | undefined;
  onClickItem: (proposalId: string | undefined) => void;
}
export function ProposalList({
  account,
  proposals,
  signer,
  activeProposalId,
  onClickItem,
}: ProposalListProps): ReactElement {
  return (
    <div className="flex w-full flex-col space-y-4 pb-8">
      {proposals.map((proposal) => (
        <ProposalListItem
          key={proposal.proposalId}
          active={proposal.proposalId === activeProposalId}
          proposal={proposal}
          onClick={onClickItem}
          account={account}
          signer={signer}
        />
      ))}
    </div>
  );
}
