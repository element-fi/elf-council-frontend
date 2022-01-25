import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ExternalLinkIcon } from "@heroicons/react/solid";
import { useWeb3React } from "@web3-react/core";
import { Proposal, ProposalsJson } from "elf-council-proposals";
import { t } from "ttag";

import { getProposalsBySnapshotId } from "src/elf-council-proposals";
import { ELEMENT_FINANCE_SNAPSHOT_URL } from "src/elf-snapshot/endpoints";
import { SnapshotProposal } from "src/elf-snapshot/queries/proposals";
import AnchorButton from "src/ui/base/Button/AnchorButton";
import { ButtonVariant } from "src/ui/base/Button/styles";
import H1 from "src/ui/base/H1";
import Tabs, { TabInfo } from "src/ui/base/Tabs/Tabs";
import { ProposalDetailsCard } from "src/ui/proposals/ProposalDetailsCard";
import { useSnapshotProposals } from "src/ui/proposals/useSnapshotProposals";
import { useSigner } from "src/ui/signer/useSigner";

import { ProposalList } from "./ProposalList/ProposalList";

type TabId = "active-proposals-tab" | "past-proposals-tab";

interface ProposalsPageProps {
  proposalsJson: ProposalsJson;
}

export default function ProposalsPage({
  proposalsJson,
}: ProposalsPageProps): ReactElement {
  const { account, library } = useWeb3React();
  const signer = useSigner(account, library);

  // TODO: Move these into the route so people can link to a proposal easily
  const [activeTabId, setActiveTab] = useState<TabId>("active-proposals-tab");
  const [activeProposalId, setActiveProposalId] = useState<
    string | undefined
  >();
  const [activeProposal, setActiveProposal] = useState<Proposal | undefined>();

  const proposalsBySnapshotId = useMemo(
    () => getProposalsBySnapshotId(proposalsJson.proposals),
    [proposalsJson.proposals],
  );

  const { data: snapshotProposals } = useSnapshotProposals(
    Object.keys(proposalsBySnapshotId),
  );

  const filteredProposals = useOnChainProposalsWithSnapshotInfo(
    activeTabId,
    snapshotProposals,
    proposalsBySnapshotId,
  );

  // set the active proposal when the user switches between Active and Past
  // tabs.
  useEffect(() => {
    setActiveProposalId(filteredProposals?.[0]?.proposalId);
    setActiveProposal(filteredProposals?.[0]);
  }, [activeTabId, filteredProposals]);

  const onSetActiveProposalId = useCallback(
    (proposalId: string | undefined) => {
      const proposal = filteredProposals?.find(
        (p) => p.proposalId === proposalId,
      );
      setActiveProposal(proposal);
      setActiveProposalId(proposalId);
    },
    [filteredProposals],
  );

  const proposalTabs: TabInfo[] = useMemo(() => {
    return [
      {
        id: "active-proposals-tab",
        current: activeTabId === "active-proposals-tab",
        onTabClick: () => setActiveTab("active-proposals-tab"),
        name: t`Active`,
      },
      {
        id: "past-proposals-tab",
        current: activeTabId === "past-proposals-tab",
        onTabClick: () => setActiveTab("past-proposals-tab"),
        name: t`Past`,
      },
    ];
  }, [activeTabId]);

  return (
    <div className="flex h-full">
      <div className="flex-1 h-full px-8 pt-8 space-y-8">
        <H1 className="flex-1 text-center">{t`Proposals`}</H1>
        <div className="flex justify-between">
          <Tabs aria-label={t`Filter proposals`} tabs={proposalTabs} />
          <OffChainProposalsLink />
        </div>
        <div className="flex space-x-12">
          <ProposalList
            account={account}
            signer={signer}
            proposals={filteredProposals || []}
            activeProposalId={activeProposalId}
            onClickItem={onSetActiveProposalId}
          />
        </div>
      </div>
      <div>
        <ProposalDetailsCard
          className="hidden lg:flex"
          account={account}
          signer={signer}
          proposal={activeProposal}
          proposalsBySnapshotId={proposalsBySnapshotId}
        />
      </div>
    </div>
  );
}

function OffChainProposalsLink() {
  return (
    <AnchorButton
      target="_blank"
      href={ELEMENT_FINANCE_SNAPSHOT_URL}
      variant={ButtonVariant.SECONDARY}
    >
      <div className="flex items-center h-full">
        {t`Off-chain`}
        <ExternalLinkIcon height={24} />
      </div>
    </AnchorButton>
  );
}

/**
 * To make sure we are only showing proposals that are deemed safe to vote on, we keep a curated
 * list of proposals hardcoded in the frontend.  The client grabs the snapshot information and we
 * link the on-chain proposal with the snapshot information.
 *
 * @param activeTabId
 * @param snapshotProposals
 * @returns
 */
function useOnChainProposalsWithSnapshotInfo(
  activeTabId: string,
  snapshotProposals: SnapshotProposal[] | undefined,
  proposalsBySnapshotId: Record<string, Proposal>,
): Proposal[] | undefined {
  return useMemo(() => {
    if (activeTabId === "active-proposals-tab") {
      return snapshotProposals
        ?.filter((snapshotProposal) =>
          ["active", "pending"].includes(snapshotProposal.state),
        )
        .map((snapshotProposal) => proposalsBySnapshotId[snapshotProposal.id]);
    }

    if (activeTabId === "past-proposals-tab") {
      const result = snapshotProposals
        ?.filter((snapshotProposal) =>
          ["closed"].includes(snapshotProposal.state),
        )
        .map((snapshotProposal) => proposalsBySnapshotId[snapshotProposal.id]);
      return result;
    }

    return [];
  }, [activeTabId, proposalsBySnapshotId, snapshotProposals]);
}
