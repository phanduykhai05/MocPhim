"use client";

import React, { useRef, useState } from "react";
import {
  PageContainer,
  ProTable,
  ProCard,
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormTextArea,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Tag, Switch, Space, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type AdItem = {
  id: number;
  name: string;
  provider: "adsense" | "banner" | "adnetwork";
  position: "home_top" | "home_sidebar" | "movie_detail" | "player_bottom";
  enabled: boolean;
  code: string;
  updatedAt: string;
};

const mockAds: AdItem[] = [
  { id: 1, name: "AdSense Header", provider: "adsense", position: "home_top", enabled: true, code: "<script>/* adsense code */</script>", updatedAt: "06/05/2026" },
  { id: 2, name: "Banner Sidebar", provider: "banner", position: "home_sidebar", enabled: true, code: "<a href='...'><img src='...'/></a>", updatedAt: "06/05/2026" },
  { id: 3, name: "Player Bottom CPM", provider: "adnetwork", position: "player_bottom", enabled: false, code: "<div id='cpm-slot'></div>", updatedAt: "05/05/2026" },
];

const providerLabel: Record<AdItem["provider"], string> = {
  adsense: "Google AdSense",
  banner: "Banner",
  adnetwork: "Ad Network",
};

const positionLabel: Record<AdItem["position"], string> = {
  home_top: "Trang chủ - Top",
  home_sidebar: "Trang chủ - Sidebar",
  movie_detail: "Chi tiết phim",
  player_bottom: "Dưới player",
};

export default function QuangCaoPage() {
  const actionRef = useRef<ActionType>();
  const { message } = App.useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const [ads, setAds] = useState<AdItem[]>(mockAds);

  const columns: ProColumns<AdItem>[] = [
    {
      title: "Tên quảng cáo",
      dataIndex: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>{providerLabel[record.provider]}</div>
        </div>
      ),
    },
    {
      title: "Vị trí hiển thị",
      dataIndex: "position",
      valueType: "select",
      valueEnum: {
        home_top: { text: "Trang chủ - Top" },
        home_sidebar: { text: "Trang chủ - Sidebar" },
        movie_detail: { text: "Chi tiết phim" },
        player_bottom: { text: "Dưới player" },
      },
      render: (_, record) => <Tag color="blue">{positionLabel[record.position]}</Tag>,
    },
    {
      title: "Bật / tắt",
      dataIndex: "enabled",
      search: false,
      width: 130,
      render: (_, record) => (
        <Switch
          checked={record.enabled}
          onChange={(checked) => {
            setAds((prev) => prev.map((ad) => (ad.id === record.id ? { ...ad, enabled: checked } : ad)));
            message.success(checked ? "Đã bật quảng cáo" : "Đã tắt quảng cáo");
          }}
        />
      ),
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      search: false,
      width: 120,
    },
  ];

  return (
    <PageContainer title="Quản lý quảng cáo" subTitle="Thêm mã quảng cáo, chọn vị trí và bật/tắt hiển thị">
      <ProCard ghost gutter={[16, 16]} wrap>
        <ProCard colSpan={{ xs: 24, md: 8 }} bordered title="Tổng quảng cáo">
          <div style={{ fontSize: 28, fontWeight: 700 }}>{ads.length}</div>
        </ProCard>
        <ProCard colSpan={{ xs: 24, md: 8 }} bordered title="Đang bật">
          <div style={{ fontSize: 28, fontWeight: 700, color: "#52c41a" }}>{ads.filter((x) => x.enabled).length}</div>
        </ProCard>
        <ProCard colSpan={{ xs: 24, md: 8 }} bordered title="Đang tắt">
          <div style={{ fontSize: 28, fontWeight: 700, color: "#faad14" }}>{ads.filter((x) => !x.enabled).length}</div>
        </ProCard>
      </ProCard>

      <div style={{ marginTop: 16 }}>
        <ProTable<AdItem>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          dataSource={ads}
          request={async () => ({ data: ads, success: true, total: ads.length })}
          toolBarRender={() => [
            <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
              Thêm mã quảng cáo
            </Button>,
          ]}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <ModalForm
        title="Thêm quảng cáo"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onFinish={async (values) => {
          console.log(values);
          message.success("Đã thêm quảng cáo mới");
          setCreateOpen(false);
          return true;
        }}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText name="name" label="Tên quảng cáo" rules={[{ required: true }]} />
        <ProFormSelect
          name="provider"
          label="Nền tảng"
          options={[
            { label: "Google AdSense", value: "adsense" },
            { label: "Banner", value: "banner" },
            { label: "Ad Network", value: "adnetwork" },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="position"
          label="Vị trí hiển thị"
          options={[
            { label: "Trang chủ - Top", value: "home_top" },
            { label: "Trang chủ - Sidebar", value: "home_sidebar" },
            { label: "Chi tiết phim", value: "movie_detail" },
            { label: "Dưới player", value: "player_bottom" },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSwitch name="enabled" label="Bật quảng cáo" initialValue />
        <ProFormTextArea
          name="code"
          label="Mã quảng cáo (Google AdSense / banner HTML)"
          fieldProps={{ rows: 5 }}
          rules={[{ required: true, message: "Vui lòng dán mã quảng cáo" }]}
        />
      </ModalForm>
    </PageContainer>
  );
}
