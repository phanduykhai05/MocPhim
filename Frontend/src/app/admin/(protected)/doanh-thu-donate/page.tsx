"use client";

import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  StatisticCard,
  ProTable,
  ProForm,
  ProFormText,
  ModalForm,
  ProFormSwitch,
  ProFormSelect,
} from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Space, Switch, Tag } from "antd";
import { DollarOutlined, GiftOutlined, CreditCardOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

type RevenueRow = {
  id: number;
  transactionCode: string;
  source: "adsense" | "banner" | "donate" | "membership";
  payerName: string;
  channel: "momo" | "bank" | "paypal" | "sepay" | "adsense" | "banner";
  method: "manual" | "sepay_webhook" | "system_report";
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  status: "paid" | "pending" | "failed" | "refunded";
  reconcileStatus: "matched" | "reviewing" | "unmatched";
  period: string;
  createdAt: string;
  paidAt?: string;
  note?: string;
};

type DonateChannel = {
  id: number;
  name: string;
  type: "momo" | "bank" | "paypal" | "sepay";
  account: string;
  enabled: boolean;
  note?: string;
};

const revenues: RevenueRow[] = [
  {
    id: 1,
    transactionCode: "ADS-20260506-001",
    source: "adsense",
    payerName: "Google AdSense",
    channel: "adsense",
    method: "system_report",
    grossAmount: 32500000,
    feeAmount: 0,
    netAmount: 32500000,
    status: "paid",
    reconcileStatus: "matched",
    period: "04/2026",
    createdAt: "01/05/2026 09:00",
    paidAt: "03/05/2026 13:20",
    note: "Đối soát theo báo cáo AdSense tháng 04",
  },
  {
    id: 2,
    transactionCode: "BNR-20260506-014",
    source: "banner",
    payerName: "Đối tác Banner A",
    channel: "banner",
    method: "manual",
    grossAmount: 12800000,
    feeAmount: 300000,
    netAmount: 12500000,
    status: "paid",
    reconcileStatus: "reviewing",
    period: "04/2026",
    createdAt: "02/05/2026 10:15",
    paidAt: "04/05/2026 18:35",
    note: "Đã nhận chuyển khoản, chờ hóa đơn VAT",
  },
  {
    id: 3,
    transactionCode: "DNT-20260506-221",
    source: "donate",
    payerName: "Nguyen Van A",
    channel: "sepay",
    method: "sepay_webhook",
    grossAmount: 500000,
    feeAmount: 0,
    netAmount: 500000,
    status: "paid",
    reconcileStatus: "matched",
    period: "05/2026",
    createdAt: "06/05/2026 10:12",
    paidAt: "06/05/2026 10:13",
    note: "Nội dung CK: MOCPHIM 221",
  },
  {
    id: 4,
    transactionCode: "MEM-20260506-078",
    source: "membership",
    payerName: "Tran Thi B",
    channel: "momo",
    method: "manual",
    grossAmount: 299000,
    feeAmount: 3500,
    netAmount: 295500,
    status: "pending",
    reconcileStatus: "unmatched",
    period: "05/2026",
    createdAt: "06/05/2026 09:40",
    note: "Chưa nhận callback xác nhận thanh toán",
  },
];

const initialChannels: DonateChannel[] = [
  { id: 1, name: "Momo", type: "momo", account: "mocphim.momo", enabled: true, note: "Ví chính" },
  { id: 2, name: "Ngân hàng ACB", type: "bank", account: "123456789 - MOC PHIM", enabled: true, note: "STK doanh nghiệp" },
  { id: 3, name: "PayPal", type: "paypal", account: "donate@mocphim.vn", enabled: false },
  { id: 4, name: "SePay QR", type: "sepay", account: "SEPAY-MOCPHIM-001", enabled: true, note: "Nhận biến động tự động" },
];

const revenueColumns: ProColumns<RevenueRow>[] = [
  {
    title: "Mã giao dịch",
    dataIndex: "transactionCode",
    copyable: true,
    width: 170,
    fixed: "left",
    render: (_, record) => (
      <div>
        <div style={{ fontWeight: 600 }}>{record.transactionCode}</div>
        <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.payerName}</div>
      </div>
    ),
  },
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
    title: "Kênh nhận",
    dataIndex: "channel",
    valueType: "select",
    valueEnum: {
      momo: { text: "Momo" },
      bank: { text: "Ngân hàng" },
      paypal: { text: "PayPal" },
      sepay: { text: "SePay" },
      adsense: { text: "AdSense" },
      banner: { text: "Banner" },
    },
    render: (_, record) => {
      const labelMap = {
        momo: "Momo",
        bank: "Ngân hàng",
        paypal: "PayPal",
        sepay: "SePay",
        adsense: "AdSense",
        banner: "Banner",
      } as const;
      return <Tag color={record.channel === "sepay" ? "geekblue" : "blue"}>{labelMap[record.channel]}</Tag>;
    },
  },
  {
    title: "Phương thức",
    dataIndex: "method",
    valueType: "select",
    valueEnum: {
      manual: { text: "Thủ công" },
      sepay_webhook: { text: "SePay Webhook" },
      system_report: { text: "Báo cáo hệ thống" },
    },
    render: (_, record) => {
      const map = {
        manual: "Thủ công",
        sepay_webhook: "SePay Webhook",
        system_report: "Báo cáo hệ thống",
      } as const;
      return map[record.method];
    },
  },
  {
    title: "Tổng tiền",
    dataIndex: "grossAmount",
    search: false,
    render: (v) => `${Number(v).toLocaleString("vi-VN")} VNĐ`,
  },
  {
    title: "Phí",
    dataIndex: "feeAmount",
    search: false,
    render: (v) => `${Number(v).toLocaleString("vi-VN")} VNĐ`,
  },
  {
    title: "Thực nhận",
    dataIndex: "netAmount",
    search: false,
    sorter: (a, b) => a.netAmount - b.netAmount,
    render: (v) => <strong>{`${Number(v).toLocaleString("vi-VN")} VNĐ`}</strong>,
  },
  {
    title: "Thanh toán",
    dataIndex: "status",
    render: (_, record) => {
      const map = {
        paid: { color: "success", text: "Đã thanh toán" },
        pending: { color: "warning", text: "Đang chờ" },
        failed: { color: "error", text: "Thất bại" },
        refunded: { color: "default", text: "Đã hoàn tiền" },
      } as const;
      const ui = map[record.status as keyof typeof map] ?? { color: "default", text: "Không xác định" };
      return <Tag color={ui.color}>{ui.text}</Tag>;
    },
  },
  {
    title: "Đối soát",
    dataIndex: "reconcileStatus",
    valueType: "select",
    valueEnum: {
      matched: { text: "Khớp" },
      reviewing: { text: "Đang rà soát" },
      unmatched: { text: "Lệch dữ liệu" },
    },
    render: (_, record) => {
      const map = {
        matched: { color: "success", text: "Khớp" },
        reviewing: { color: "processing", text: "Đang rà soát" },
        unmatched: { color: "error", text: "Lệch dữ liệu" },
      } as const;
      const ui = map[record.reconcileStatus as keyof typeof map] ?? { color: "default", text: "Không xác định" };
      return <Tag color={ui.color}>{ui.text}</Tag>;
    },
  },
  { title: "Kỳ", dataIndex: "period", search: false },
  { title: "Tạo lúc", dataIndex: "createdAt", search: false, width: 150 },
  {
    title: "Xác nhận",
    dataIndex: "paidAt",
    search: false,
    width: 150,
    render: (v) => v || "-",
  },
];

export default function DoanhThuDonatePage() {
  const { message } = App.useApp();
  const [channels, setChannels] = useState<DonateChannel[]>(initialChannels);
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<DonateChannel | null>(null);
  const totalRevenue = revenues.reduce((sum, item) => sum + item.netAmount, 0);

  const channelTypeLabel: Record<DonateChannel["type"], string> = {
    momo: "Momo",
    bank: "Ngân hàng",
    paypal: "PayPal",
    sepay: "SePay",
  };

  const channelColumns: ProColumns<DonateChannel>[] = [
    {
      title: "Kênh",
      dataIndex: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.name}</div>
          <Tag color={record.type === "sepay" ? "geekblue" : "blue"}>{channelTypeLabel[record.type]}</Tag>
        </div>
      ),
    },
    { title: "Tài khoản nhận", dataIndex: "account" },
    {
      title: "Ghi chú",
      dataIndex: "note",
      search: false,
      ellipsis: true,
      render: (v) => v || "-",
    },
    {
      title: "Bật / tắt",
      dataIndex: "enabled",
      width: 120,
      search: false,
      render: (_, record) => (
        <Switch
          checked={record.enabled}
          onChange={(checked) => {
            setChannels((prev) => prev.map((x) => (x.id === record.id ? { ...x, enabled: checked } : x)));
            message.success(checked ? "Đã bật kênh donate" : "Đã tắt kênh donate");
          }}
        />
      ),
    },
    {
      title: "Thao tác",
      valueType: "option",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingChannel(record);
              setChannelModalOpen(true);
            }}
          />
          <Popconfirm
            title="Xóa kênh donate này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => {
              setChannels((prev) => prev.filter((x) => x.id !== record.id));
              message.success(`Đã xóa kênh: ${record.name}`);
            }}
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
              value: revenues.filter((x) => x.source === "donate").reduce((sum, x) => sum + x.netAmount, 0),
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
            options={channels.map((x) => ({ label: `${x.name} (${channelTypeLabel[x.type]})`, value: x.type }))}
          />
          <ProFormText name="thankYouMessage" label="Thông điệp cảm ơn" />
        </ProForm>
      </ProCard>

      <ProCard title="Tích hợp SePay" bordered style={{ marginTop: 16 }}>
        <ProForm
          layout="vertical"
          initialValues={{
            enableSepay: true,
            sepayApiBaseUrl: "https://my.sepay.vn/userapi",
            sepayApiKey: "",
            sepayWebhookSecret: "",
            sepayBankCode: "ACB",
            sepayAccountNumber: "123456789",
            sepayAccountName: "MOC PHIM",
            sepayTransferPrefix: "MOCPHIM",
            autoConfirmDonateByTransfer: true,
          }}
          onFinish={async (values) => {
            console.log(values);
            message.success("Đã lưu cấu hình tích hợp SePay");
          }}
          submitter={{ searchConfig: { submitText: "Lưu tích hợp SePay" } }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <ProFormSwitch name="enableSepay" label="Bật tích hợp SePay" />
            <ProFormSwitch name="autoConfirmDonateByTransfer" label="Tự động xác nhận donate khi khớp giao dịch" />
            <ProFormText name="sepayApiBaseUrl" label="SePay API Base URL" rules={[{ required: true }]} />
            <ProFormText.Password name="sepayApiKey" label="SePay API Key" rules={[{ required: true }]} />
            <ProFormText.Password name="sepayWebhookSecret" label="Webhook Secret" />
            <ProFormSelect
              name="sepayBankCode"
              label="Ngân hàng nhận tiền"
              options={[
                { label: "ACB", value: "ACB" },
                { label: "Vietcombank", value: "VCB" },
                { label: "MB Bank", value: "MBBANK" },
                { label: "Techcombank", value: "TCB" },
              ]}
            />
            <ProFormText name="sepayAccountNumber" label="Số tài khoản nhận" rules={[{ required: true }]} />
            <ProFormText name="sepayAccountName" label="Tên chủ tài khoản" rules={[{ required: true }]} />
            <ProFormText name="sepayTransferPrefix" label="Tiền tố nội dung chuyển khoản" placeholder="MOCPHIM" />
          </div>
        </ProForm>
      </ProCard>

      <ProCard title="Lịch sử doanh thu" bordered style={{ marginTop: 16 }}>
        <ProTable<RevenueRow>
          rowKey="id"
          columns={revenueColumns}
          request={async () => ({ data: revenues, success: true, total: revenues.length })}
          scroll={{ x: 1600 }}
          search={{ labelWidth: "auto" }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                <div><strong>Mã giao dịch:</strong> {record.transactionCode}</div>
                <div><strong>Người thanh toán:</strong> {record.payerName}</div>
                <div><strong>Nguồn thu:</strong> {record.source}</div>
                <div><strong>Kênh:</strong> {record.channel}</div>
                <div><strong>Phương thức:</strong> {record.method}</div>
                <div><strong>Kỳ:</strong> {record.period}</div>
                <div><strong>Tổng tiền:</strong> {record.grossAmount.toLocaleString("vi-VN")} VNĐ</div>
                <div><strong>Phí:</strong> {record.feeAmount.toLocaleString("vi-VN")} VNĐ</div>
                <div><strong>Thực nhận:</strong> {record.netAmount.toLocaleString("vi-VN")} VNĐ</div>
                <div><strong>Tạo lúc:</strong> {record.createdAt}</div>
                <div><strong>Xác nhận:</strong> {record.paidAt || "-"}</div>
                <div><strong>Ghi chú:</strong> {record.note || "-"}</div>
              </div>
            ),
          }}
          pagination={{ pageSize: 8 }}
        />
      </ProCard>

      <ProCard title="Kênh nhận donate" bordered style={{ marginTop: 16 }}>
        <ProTable<DonateChannel>
          rowKey="id"
          columns={channelColumns}
          dataSource={channels}
          request={async () => ({ data: channels, success: true, total: channels.length })}
          toolBarRender={() => [
            <Button
              key="add-channel"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingChannel(null);
                setChannelModalOpen(true);
              }}
            >
              Thêm kênh
            </Button>,
          ]}
          search={false}
          pagination={{ pageSize: 8 }}
        />
      </ProCard>

      <ModalForm
        title={editingChannel ? "Chỉnh sửa kênh donate" : "Thêm kênh donate"}
        open={channelModalOpen}
        onOpenChange={setChannelModalOpen}
        initialValues={{
          name: editingChannel?.name,
          type: editingChannel?.type,
          account: editingChannel?.account,
          enabled: editingChannel?.enabled ?? true,
          note: editingChannel?.note,
        }}
        onFinish={async (values) => {
          const nextType = String(values.type) as DonateChannel["type"];
          const nextData: DonateChannel = {
            id: editingChannel?.id ?? Date.now(),
            name: String(values.name),
            type: nextType,
            account: String(values.account),
            enabled: Boolean(values.enabled),
            note: values.note ? String(values.note) : undefined,
          };

          if (editingChannel) {
            setChannels((prev) => prev.map((x) => (x.id === editingChannel.id ? nextData : x)));
            message.success("Đã cập nhật kênh donate");
          } else {
            setChannels((prev) => [nextData, ...prev]);
            message.success("Đã thêm kênh donate mới");
          }
          return true;
        }}
        modalProps={{ destroyOnHidden: true }}
      >
        <ProFormText name="name" label="Tên kênh" rules={[{ required: true }]} />
        <ProFormSelect
          name="type"
          label="Loại kênh"
          options={[
            { label: "Momo", value: "momo" },
            { label: "Ngân hàng", value: "bank" },
            { label: "PayPal", value: "paypal" },
            { label: "SePay", value: "sepay" },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="account" label="Tài khoản nhận" rules={[{ required: true }]} />
        <ProFormSwitch name="enabled" label="Bật kênh này" />
        <ProFormText name="note" label="Ghi chú" />
      </ModalForm>
    </PageContainer>
  );
}
