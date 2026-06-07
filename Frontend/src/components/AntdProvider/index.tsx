"use client";

import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider, App } from "antd";
import viVN from "antd/locale/vi_VN";
import type { ReactNode } from "react";

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={viVN} warning={{ strict: false }}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
