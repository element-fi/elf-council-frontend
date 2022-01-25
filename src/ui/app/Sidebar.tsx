import React, { Fragment, ReactElement, useCallback, useState } from "react";
import { MenuAlt4Icon } from "@heroicons/react/solid";
import { XIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter, NextRouter } from "next/router";
import classNames from "classnames";
import { t } from "ttag";
import Image from "next/image";
import { ElementLogo } from "src/ui/base/ElementLogo";
import { RESOURCES_URL } from "src/ui/resources";

export default function Sidebar(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Fragment>
      <button
        className="z-20 fixed top-0 left-0 flex items-center justify-center w-12 h-12 p-0 rounded-md cursor-pointer md:hidden hover:shadow"
        onClick={onOpen}
      >
        <MenuAlt4Icon className="w-6 h-6" />
      </button>
      <div
        className={classNames(
          { "-translate-x-full": !isOpen },
          "flex flex-col items-center w-full md:w-60 h-full py-14 ease-in-out transition-all duration-300 z-10 fixed top-0 left-0 bg-white transform-gpu md:translate-x-0",
        )}
      >
        <div className="flex justify-around py-3 mt-1">
          <div className="relative w-24 h-24">
            <Image
              layout="fill"
              src="/assets/CouncilLogo.svg"
              alt={t`Element Council logo`}
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 flex items-center justify-center w-12 h-12 p-0 rounded-md cursor-pointer md:hidden hover:shadow"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="w-full mt-8 space-y-6">
          <SidebarLink link="/" label={t`Overview`} router={router} />
          <SidebarLink link="/proposals" label={t`Proposals`} router={router} />
          <SidebarLink link="/delegates" label={t`Delegate`} router={router} />
          <SidebarLinkExternal
            link="https://forum.element.fi"
            label={t`Forum`}
          />
          <SidebarLinkExternal link={RESOURCES_URL} label={t`Resources`} />
        </div>
        <div className="flex flex-col items-center mt-auto text-principalRoyalBlue">
          <span className="text-sm">Powered by</span>
          <ElementLogo height={"40"} />
        </div>
      </div>
    </Fragment>
  );
}

interface SidebarLinkProps {
  link: string;
  label: string;
  router: NextRouter;
}

interface SidebarLinkExternalProps {
  link: string;
  label: string;
}

function SidebarLink(props: SidebarLinkProps): ReactElement {
  const { link, label, router } = props;

  const isActive = router.pathname === link;

  return (
    <div>
      <Link href={link}>
        {/* There's a big discussion about how awful the Link api is for a11y
      here: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/402 the
      best thing to do for now is just ignore this rule when an anchor tag is
      the child of a Link since all a tags *should* have an href 🙁 */
        /* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>
          <div
            className={classNames(
              "flex justify-center p-3 hover:bg-blue-50 cursor-pointer text-brandDarkBlue-dark",
              { "font-bold": isActive },
            )}
          >
            <p>{label}</p>
          </div>
        </a>
      </Link>
    </div>
  );
}

function SidebarLinkExternal(props: SidebarLinkExternalProps): ReactElement {
  const { link, label } = props;
  return (
    <div>
      <a href={link}>
        <div className="flex justify-center p-3 cursor-pointer hover:bg-blue-50 text-brandDarkBlue-dark">
          <p>{label}</p>
        </div>
      </a>
    </div>
  );
}
