"use client";

import React from "react";
import {
  PageContainer,
  ProCard,
  StatisticCard,
  ProTable,
  ProForm,
  ProFormText,
  ProFormSwitch,
  ProFormSelect,
} from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { App, Tag } from "antd";
import { DollarOutlined, GiftOutlined, CreditCardOutlined } from "@ant-design/icons";

type RevenueRow = {
  id: number;
  source: "adsense" | "banner" | "donate" | "membership";
  amount: number;
  status: "paid" | "pending";
  period: string;
};

type DonateChannel = {
  id: number;
  name: string;
  account: string;
  enabled: boolean;
};

const revenues: RevenueRow[] = [
  { id: 1, source: "adsense", amount: 32500000, status: "paid", period: "04/2026" },
  { id: 2, source: "banner", amount: 12800000, status: "paid", period: "04/2026" },
  { id: 3, source: "donate", amount: 4700000, status: "paid", period: "04/2026" },
  { id: 4, source: "membership", amount: 9200000, status: "pending", period: "05/2026" },
];

const channels: DonateChannel[] = [
  { id: 1, name: "Momo", account: "mocphim.momo", enabled: true },
  { id: 2, name: "Ngân hàng ACB", account: "123456789 - MOC PHIM", enabled: true },
  { id: 3, name: "PayPal", account: "donate@mocphim.vn", enabled: false },
];

const revenueColumns: ProColumns<RevenueRow>[] = [
  {
    title: "Nguồn thu",
    dataIndex: "source",
    valueEnum: {
      adsense: { text: "Google AdSense" },
      banner: { text: "Banner" },
      donate: { text: "Donate" },
      membership: { text: "Membership" },
    },
    render: (_, record) => {
      const map = {
        adsense: "Google AdSense",
        banner: "Banner",
        donate: "Donate",
        membership: "Membership",
      } as const;
      return map[record.source];
    },
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    search: false,
    render: (v) => `${Number(v).toLocaleString("vi-VN")} VNĐ`,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (_, record) => (
      <Tag color={record.status === "paid" ? "success" : "warning"}>
        {record.status === "paid" ? "Đã thanh toán" : "Đang chờ"}
      </Tag>
    ),
  },
  { title: "Kỳ", dataIndex: "period", search: false },
];

const channelColumns: ProColumns<DonateChannel>[] = [
  { title: "Kênh", dataIndex: "name" },
  { title: "Tài khoản nhận", dataIndex: "account" },
  {
    title: "Trạng thái",
    dataIndex: "enabled",
    render: (_, record) => (
      <Tag color={record.enabled ? "success" : "default"}>{record.enabled ? "Đang bật" : "Đang tắt"}</Tag>
    ),
  },
];

export default function DoanhThuDonatePage() {
  const { message } = App.useApp();
  const totalRevenue = revenues.reduce((sum, item) => sum + item.amount, 0);

  return (
    <PageContainer title="Doanh thu & donate" subTitle="Theo dõi nguồn thu quảng cáo và đóng góp người dùng">
      <ProCard ghost gutter={[16, 16]} wrap>
        <ProCard colSpan={{ xs: 24, md: 8 }} bordered>
          <StatisticCard
            statistic={{
              title: "Tổng doanh thu tháng",
              value: totalRevenue,
              suffix: "VNĐ",
              icon: <DollarOutlined style={{ color: "#1677ff" }} />,
            }}
          />
        </ProCard>
        <ProCard colSpan={{ xs: 24, md: 8 }} bordered>
          <StatisticCard
            statistic={{
              title: "Donate tháng này",
              value: revenues.filter((x) => x.source === "donate").reduce((sum, x) => sum + x.amount, 0),
              suffix: "VNĐ",
              icon: <GiftOutlined style={{ color: "#fa8c16" }} />,
            }}
          />
        </ProCard>
        <ProCard colSpan={{ xs: 24, md: 8 }} bordered>
          <StatisticCard
            statistic={{
              title: "Nguồn thu đang hoạt động",
              value: channels.filter((x) => x.enabled).length,
              suffix: "kênh",
              icon: <CreditCardOutlined style={{ color: "#52c41a" }} />,
            }}
          />
        </ProCard>
      </ProCard>

      <ProCard title="Cấu hình donate" bordered style={{ marginTop: 16 }}>
        <ProForm
          layout="vertical"
          initialValues={{
            enableDonate: true,
            defaultChannel: "momo",
            thankYouMessage: "Cảm ơn bạn đã ủng hộ MocPhim!",
          }}
          onFinish={async (values) => {
            console.log(values);
            message.success("Đã lưu cấu hình donate");
          }}
          submitter={{ searchConfig: { submitText: "Lưu cấu hình" } }}
        >
          <ProFormSwitch name="enableDonate" label="Bật khu vực donate trên website" />
          <ProFormSelect
            name="defaultChannel"
            label="Kênh donate mặc định"
            options={[
              { label: "Momo", value: "momo" },
              { label: "Ngân hàng", value: "bank" },
              { label: "PayPal", value: "paypal" },
            ]}
          />
          <ProFormText name="thankYouMessage" label="Thông điệp cảm ơn" />
        </ProForm>
      </ProCard>

      <ProCard title="Lịch sử doanh thu" bordered style={{ marginTop: 16 }}>
        <ProTable<RevenueRow>
          rowKey="id"
          columns={revenueColumns}
          request={async () => ({ data: revenues, success: true, total: revenues.length })}
          pagination={{ pageSize: 8 }}
        />
      </ProCard>

      <ProCard title="Kênh nhận donate" bordered style={{ marginTop: 16 }}>
        <ProTable<DonateChannel>
          rowKey="id"
          columns={channelColumns}
          request={async () => ({ data: channels, success: true, total: channels.length })}
          search={false}
          pagination={{ pageSize: 8 }}
        />
      </ProCard>
    </PageContainer>
  );
}
