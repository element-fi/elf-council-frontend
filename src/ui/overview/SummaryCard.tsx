import { InformationCircleIcon } from "@heroicons/react/outline";
import React, { ReactElement, ReactNode } from "react";

import Card from "src/ui/base/Card/Card";
import Tooltip from "src/ui/base/Tooltip/Tooltip";

interface SummaryCardProps {
  title: string | ReactElement;
  tooltipContent?: string | ReactElement;

  href?: string;
  balance?: ReactNode;
  children?: ReactNode;
}
export function SummaryCard(props: SummaryCardProps): ReactElement {
  const { title, balance, children, tooltipContent } = props;

  return (
    <Card className="flex flex-col lg:flex-1">
      <div className="flex items-center justify-center text-principalRoyalBlue">
        {title}
        {tooltipContent ? (
          <Tooltip content={tooltipContent}>
            <InformationCircleIcon className="h-4 ml-1 cursor-help" />
          </Tooltip>
        ) : null}
      </div>
      <div className="flex items-center justify-center flex-1 py-4 text-5xl text-center font-extralight text-principalRoyalBlue">
        {balance}
      </div>
      {children}
    </Card>
  );
}

export default SummaryCard;
