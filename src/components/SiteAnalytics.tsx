"use client";

import { useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

type NavigatorWithGPC = Navigator & { globalPrivacyControl?: boolean };

const subscribe = () => () => {};
const onClient = () => !(navigator as NavigatorWithGPC).globalPrivacyControl;
const onServer = () => false;

/** Google Analytics, except for visitors whose browser sends the Global
    Privacy Control signal: for them it never loads. The promise is made
    on /privacy, so keep the two in step. */
export default function SiteAnalytics({ gaId }: { gaId: string }) {
  const allowed = useSyncExternalStore(subscribe, onClient, onServer);
  return allowed ? <GoogleAnalytics gaId={gaId} /> : null;
}
