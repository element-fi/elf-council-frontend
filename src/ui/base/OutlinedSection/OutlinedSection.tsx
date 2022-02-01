import classNames from "classnames";
import { ReactElement, ReactNode } from "react";

interface OutlinedSectionProps {
  children?: ReactNode;
  className?: string;
}

export default function OutlinedSection({
  children,
  className,
}: OutlinedSectionProps): ReactElement {
  return (
    <div className="overflow-hidden border border-brandDarkBlue-dark rounded-lg">
      <div className={classNames("px-4 py-5 sm:p-6", className)}>
        {children}
      </div>
    </div>
  );
}
