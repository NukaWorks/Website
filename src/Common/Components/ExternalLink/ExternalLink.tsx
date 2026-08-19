import type { AnchorHTMLAttributes } from "react";
import { useExternalLink } from "../../../Services/externalLink";

export interface ExternalLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "rel" | "target"> {
  href: string;
  label: string;
}

/**
 * An outbound link routed through the confirm-before-leaving dialog. The real href stays on the
 * element so hover, copy and open-in-new-tab behave normally; only the plain click is intercepted.
 */
export default function ExternalLink({
  href,
  label,
  children,
  onClick,
  ...anchorProps
}: ExternalLinkProps) {
  const { request } = useExternalLink();

  return (
    <a
      {...anchorProps}
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        request(href, label);
      }}
    >
      {children}
    </a>
  );
}
