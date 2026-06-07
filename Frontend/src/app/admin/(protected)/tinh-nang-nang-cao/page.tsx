"use client";

import React from "react";
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormSwitch,
  ProFormSelect,
  ProTable,
} from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { App, Tag } from "antd";

type StreamingNode = {
  id: number;
  node: string;
  region: string;
  status: "online" | "degraded" | "offline";
  bandwidth: string;
};

type SubtitleLang = {
  id: number;
  language: string;
  code: string;
  movies: number;
  isDefault: boolean;
};

const nodes: StreamingNode[] = [
  { id: 1, node: "stream-vn-01", region: "Ho Chi Minh", status: "online", bandwidth: "5.2 Gbps" },
  { id: 2, node: "stream-sg-02", region: "Singapore", status: "online", bandwidth: "4.8 Gbps" },
  { id: 3, node: "stream-us-01", region: "US West", status: "degraded", bandwidth: "2.1 Gbps" },
];

const subtitles: SubtitleLang[] = [
  { id: 1, language: "Tiếng Việt", code: "vi", movies: 1040, isDefault: true },
  { id: 2, language: "English", code: "en", movies: 560, isDefault: false },
  { id: 3, language: "Japanese", code: "ja", movies: 112, isDefault: false },
  { id: 4, language: "Korean", code: "ko", movies: 94, isDefault: false },
];

const nodeColumns: ProColumns<StreamingNode>[] = [
  { title: "Server", dataIndex: "node" },
  { title: "Khu vực", dataIndex: "region" },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (_, record) => {
      const map = {
        online: { color: "success", text: "Online" },
        degraded: { color: "warning", text: "Giảm hiệu năng" },
        offline: { color: "error", text: "Offline" },
      } as const;
      return <Tag color={map[record.status].color}>{map[record.status].text}</Tag>;
    },
  },
  { title: "Băng thông", dataIndex: "bandwidth", search: false },
];

const subtitleColumns: ProColumns<SubtitleLang>[] = [
  { title: "Ngôn ngữ", dataIndex: "language" },
  { title: "Mã", dataIndex: "code", search: false },
  { title: "Số phim có phụ đề", dataIndex: "movies", search: false },
  {
    title: "Mặc định",
    dataIndex: "isDefault",
    search: false,
    render: (_, record) => (record.isDefault ? <Tag color="blue">Mặc định</Tag> : <Tag>Phụ</Tag>),
  },
];

export default function TinhNangNangCaoPage() {
  const { message } = App.useApp();

  return (
    <PageContainer title="Nâng cao" subTitle="AI gợi ý phim, recommendation, streaming và subtitles">
      <ProCard ghost gutter={[16, 16]} direction="column">
        <ProCard title="Cấu hình AI / Recommendation" bordered>
          <ProForm
            layout="vertical"
            initialValues={{
              aiSuggestion: true,
              recommendationSystem: true,
              recommendationModel: "hybrid_v2",
              subtitleAutoTranslate: false,
            }}
            onFinish={async (values) => {
              console.log(values);
              message.success("Đã lưu cấu hình nâng cao");
            }}
            submitter={{ searchConfig: { submitText: "Lưu cấu hình" } }}
          >
            <ProFormSwitch name="aiSuggestion" label="Bật AI gợi ý phim" />
            <ProFormSwitch name="recommendationSystem" label="Bật hệ thống recommendation" />
            <ProFormSelect
              name="recommendationModel"
              label="Mô hình recommendation"
              options={[
                { label: "Hybrid v2", value: "hybrid_v2" },
                { label: "Collaborative Filtering", value: "collab" },
                { label: "Content-based", value: "content" },
              ]}
            />
            <ProFormSwitch name="subtitleAutoTranslate" label="Tự động dịch phụ đề đa ngôn ngữ" />
          </ProForm>
        </ProCard>

        <ProCard title="Quản lý server streaming" bordered>
          <ProTable<StreamingNode>
            rowKey="id"
            columns={nodeColumns}
            request={async () => ({ data: nodes, success: true, total: nodes.length })}
            search={false}
            pagination={{ pageSize: 6 }}
          />
        </ProCard>

        <ProCard title="Subtitles (phụ đề nhiều ngôn ngữ)" bordered>
          <ProTable<SubtitleLang>
            rowKey="id"
            columns={subtitleColumns}
            request={async () => ({ data: subtitles, success: true, total: subtitles.length })}
            search={false}
            pagination={{ pageSize: 6 }}
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
