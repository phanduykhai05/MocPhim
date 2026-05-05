"use client";

import React from "react";
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSwitch,
  ProFormSelect,
  ProTable,
  StatisticCard,
} from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { App, Button, Space, Tag } from "antd";
import { SearchOutlined, LinkOutlined, FileTextOutlined } from "@ant-design/icons";

type IndexUrl = {
  id: number;
  url: string;
  type: "home" | "category" | "movie" | "episode" | "news";
  priority: string;
  changeFreq: "always" | "hourly" | "daily" | "weekly" | "monthly";
  status: "indexed" | "pending" | "blocked";
  lastUpdated: string;
};

type SchemaProfile = {
  id: number;
  pageType: "home" | "movie" | "episode" | "category";
  schemaType: "WebSite" | "Movie" | "TVSeries" | "BreadcrumbList" | "VideoObject";
  enabled: boolean;
  validation: "valid" | "warning" | "error";
  lastChecked: string;
};

const mockIndexUrls: IndexUrl[] = [
  {
    id: 1,
    url: "https://mocphim.vn/",
    type: "home",
    priority: "1.0",
    changeFreq: "always",
    status: "indexed",
    lastUpdated: "06/05/2026 09:30",
  },
  {
    id: 2,
    url: "https://mocphim.vn/phimmoi",
    type: "category",
    priority: "0.9",
    changeFreq: "daily",
    status: "indexed",
    lastUpdated: "06/05/2026 09:25",
  },
  {
    id: 3,
    url: "https://mocphim.vn/phim/one-piece",
    type: "movie",
    priority: "0.8",
    changeFreq: "daily",
    status: "indexed",
    lastUpdated: "06/05/2026 08:10",
  },
  {
    id: 4,
    url: "https://mocphim.vn/xem-phim/one-piece-tap-1157",
    type: "episode",
    priority: "0.7",
    changeFreq: "hourly",
    status: "pending",
    lastUpdated: "06/05/2026 10:05",
  },
  {
    id: 5,
    url: "https://mocphim.vn/tin-tuc/lich-cap-nhat-thang-5",
    type: "news",
    priority: "0.5",
    changeFreq: "weekly",
    status: "blocked",
    lastUpdated: "05/05/2026 13:40",
  },
];

const mockSchemaProfiles: SchemaProfile[] = [
  {
    id: 1,
    pageType: "home",
    schemaType: "WebSite",
    enabled: true,
    validation: "valid",
    lastChecked: "06/05/2026 09:40",
  },
  {
    id: 2,
    pageType: "movie",
    schemaType: "Movie",
    enabled: true,
    validation: "valid",
    lastChecked: "06/05/2026 09:35",
  },
  {
    id: 3,
    pageType: "episode",
    schemaType: "VideoObject",
    enabled: true,
    validation: "warning",
    lastChecked: "06/05/2026 08:58",
  },
  {
    id: 4,
    pageType: "category",
    schemaType: "BreadcrumbList",
    enabled: false,
    validation: "error",
    lastChecked: "05/05/2026 22:15",
  },
];

const indexColumns: ProColumns<IndexUrl>[] = [
  {
    title: "URL",
    dataIndex: "url",
    ellipsis: true,
    render: (_, record) => (
      <a href={record.url} target="_blank" rel="noreferrer">
        {record.url}
      </a>
    ),
  },
  {
    title: "Loại",
    dataIndex: "type",
    valueType: "select",
    valueEnum: {
      home: { text: "Trang chủ" },
      category: { text: "Danh mục" },
      movie: { text: "Phim" },
      episode: { text: "Tập phim" },
      news: { text: "Tin tức" },
    },
  },
  {
    title: "Priority",
    dataIndex: "priority",
    search: false,
  },
  {
    title: "Changefreq",
    dataIndex: "changeFreq",
    valueType: "select",
    valueEnum: {
      always: { text: "always" },
      hourly: { text: "hourly" },
      daily: { text: "daily" },
      weekly: { text: "weekly" },
      monthly: { text: "monthly" },
    },
  },
  {
    title: "Trạng thái index",
    dataIndex: "status",
    render: (_, record) => {
      const map = {
        indexed: { color: "success", text: "Đã index" },
        pending: { color: "processing", text: "Đang chờ" },
        blocked: { color: "error", text: "Chặn index" },
      } as const;
      return <Tag color={map[record.status].color}>{map[record.status].text}</Tag>;
    },
  },
  {
    title: "Cập nhật",
    dataIndex: "lastUpdated",
    search: false,
    width: 150,
  },
];

const schemaColumns: ProColumns<SchemaProfile>[] = [
  {
    title: "Loại trang",
    dataIndex: "pageType",
    valueType: "select",
    valueEnum: {
      home: { text: "Trang chủ" },
      movie: { text: "Trang phim" },
      episode: { text: "Trang xem phim" },
      category: { text: "Trang danh mục" },
    },
  },
  {
    title: "Schema",
    dataIndex: "schemaType",
  },
  {
    title: "Bật / tắt",
    dataIndex: "enabled",
    search: false,
    render: (_, record) => <Tag color={record.enabled ? "success" : "default"}>{record.enabled ? "Bật" : "Tắt"}</Tag>,
  },
  {
    title: "Trạng thái Rich Result",
    dataIndex: "validation",
    render: (_, record) => {
      const map = {
        valid: { color: "success", text: "Hợp lệ" },
        warning: { color: "warning", text: "Cảnh báo" },
        error: { color: "error", text: "Lỗi" },
      } as const;
      return <Tag color={map[record.validation].color}>{map[record.validation].text}</Tag>;
    },
  },
  {
    title: "Kiểm tra gần nhất",
    dataIndex: "lastChecked",
    search: false,
    width: 150,
  },
];

export default function SeoSitemapPage() {
  const { message } = App.useApp();

  return (
    <PageContainer title="Quản lý SEO & sitemap" subTitle="Thiết lập SEO, robots và sitemap cho toàn bộ hệ thống">
      <ProCard ghost gutter={[16, 16]} wrap>
        <ProCard colSpan={{ xs: 24, md: 8 }} bordered>
          <StatisticCard
            statistic={{
              title: "URL trong sitemap",
              value: 12356,
              icon: <LinkOutlined style={{ color: "#1677ff" }} />,
            }}
          />
        </ProCard>
        <ProCard colSpan={{ xs: 24, md: 8 }} bordered>
          <StatisticCard
            statistic={{
              title: "URL đã index",
              value: 11294,
              icon: <SearchOutlined style={{ color: "#52c41a" }} />,
            }}
          />
        </ProCard>
        <ProCard colSpan={{ xs: 24, md: 8 }} bordered>
          <StatisticCard
            statistic={{
              title: "URL bị chặn",
              value: 182,
              icon: <FileTextOutlined style={{ color: "#fa8c16" }} />,
            }}
          />
        </ProCard>
      </ProCard>

      <ProCard title="Meta tag mặc định" bordered style={{ marginTop: 16 }}>
        <ProForm
          layout="vertical"
          initialValues={{
            siteTitle: "MocPhim - Xem phim online miễn phí",
            titleTemplate: "%s | MocPhim",
            defaultDescription: "MocPhim cung cấp phim online chất lượng cao, cập nhật nhanh liên tục.",
            defaultKeywords: "xem phim, phim online, phim vietsub, phim moi",
            canonicalDomain: "https://mocphim.vn",
            autoCanonical: true,
            autoOpenGraph: true,
            autoTwitterCard: true,
            defaultRobotsMeta: "index,follow,max-image-preview:large",
          }}
          onFinish={async (values) => {
            console.log(values);
            message.success("Đã lưu cấu hình Meta tag");
          }}
          submitter={{ searchConfig: { submitText: "Lưu Meta tag" } }}
        >
          <ProFormText name="siteTitle" label="Site title mặc định" rules={[{ required: true }]} />
          <ProFormText name="titleTemplate" label="Title template" placeholder="%s | MocPhim" />
          <ProFormTextArea name="defaultDescription" label="Meta description mặc định" fieldProps={{ rows: 3 }} />
          <ProFormText name="defaultKeywords" label="Meta keywords mặc định" />
          <ProFormText name="defaultRobotsMeta" label="Meta robots mặc định" />
          <ProFormText
            name="canonicalDomain"
            label="Canonical domain"
            rules={[{ required: true }, { type: "url", message: "Domain không hợp lệ" }]}
          />
          <ProFormSwitch name="autoCanonical" label="Tự động gắn canonical" />
          <ProFormSwitch name="autoOpenGraph" label="Tự động tạo Open Graph" />
          <ProFormSwitch name="autoTwitterCard" label="Tự động tạo Twitter Card" />
        </ProForm>
      </ProCard>

      <ProCard
        title="Tạo sitemap"
        bordered
        style={{ marginTop: 16 }}
        extra={
          <Space>
            <Button onClick={() => message.success("Đã tạo lại sitemap thủ công")}>Tạo lại sitemap</Button>
            <Button type="primary" onClick={() => message.success("Đã ping sitemap lên Google/Bing")}>Ping Search Engine</Button>
          </Space>
        }
      >
        <ProForm
          layout="vertical"
          initialValues={{
            enableSitemap: true,
            includeImageSitemap: true,
            includeVideoSitemap: true,
            sitemapSplitSize: "5000",
            pingSearchEngine: true,
            robotsMode: "custom",
            robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://mocphim.vn/sitemap.xml",
          }}
          onFinish={async (values) => {
            console.log(values);
            message.success("Đã lưu cấu hình tạo sitemap");
          }}
          submitter={{ searchConfig: { submitText: "Lưu cấu hình sitemap" } }}
        >
          <ProFormSwitch name="enableSitemap" label="Bật tự động tạo sitemap.xml" />
          <ProFormSwitch name="includeImageSitemap" label="Sinh image-sitemap.xml" />
          <ProFormSwitch name="includeVideoSitemap" label="Sinh video-sitemap.xml" />
          <ProFormSelect
            name="sitemapSplitSize"
            label="Số URL mỗi file sitemap"
            options={["1000", "5000", "10000", "20000"].map((v) => ({ label: v, value: v }))}
          />
          <ProFormSwitch name="pingSearchEngine" label="Tự động ping Google/Bing khi cập nhật sitemap" />
        </ProForm>
      </ProCard>

      <ProCard title="Tối ưu URL" bordered style={{ marginTop: 16 }}>
        <ProForm
          layout="vertical"
          initialValues={{
            urlPatternMovie: "/phim/{slug}",
            urlPatternEpisode: "/xem-phim/{slug}-{episode}",
            forceLowercaseSlug: true,
            removeStopWords: true,
            maxSlugLength: "80",
            redirectOldSlug: true,
          }}
          onFinish={async (values) => {
            console.log(values);
            message.success("Đã lưu cấu hình tối ưu URL");
          }}
          submitter={{ searchConfig: { submitText: "Lưu tối ưu URL" } }}
        >
          <ProFormText name="urlPatternMovie" label="Mẫu URL phim" rules={[{ required: true }]} />
          <ProFormText name="urlPatternEpisode" label="Mẫu URL tập phim" rules={[{ required: true }]} />
          <ProFormSwitch name="forceLowercaseSlug" label="Ép slug chữ thường" />
          <ProFormSwitch name="removeStopWords" label="Bỏ stop-words trong slug" />
          <ProFormSelect
            name="maxSlugLength"
            label="Giới hạn độ dài slug"
            options={["60", "80", "100", "120"].map((v) => ({ label: `${v} ký tự`, value: v }))}
          />
          <ProFormSwitch name="redirectOldSlug" label="Tự động 301 redirect URL cũ" />
        </ProForm>
      </ProCard>

      <ProCard title="Robots.txt" bordered style={{ marginTop: 16 }}>
        <ProForm
          layout="vertical"
          initialValues={{
            robotsMode: "custom",
            robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://mocphim.vn/sitemap.xml",
          }}
          onFinish={async (values) => {
            console.log(values);
            message.success("Đã lưu robots.txt");
          }}
          submitter={{ searchConfig: { submitText: "Lưu robots.txt" } }}
        >
          <ProFormSelect
            name="robotsMode"
            label="Chế độ robots.txt"
            options={[
              { label: "Mặc định", value: "default" },
              { label: "Tuỳ chỉnh", value: "custom" },
              { label: "Chặn toàn bộ", value: "block_all" },
            ]}
          />
          <ProFormTextArea name="robotsTxt" label="Nội dung robots.txt" fieldProps={{ rows: 6 }} />
        </ProForm>
      </ProCard>

      <ProCard title="Schema (Google rich results)" bordered style={{ marginTop: 16 }}>
        <ProForm
          layout="vertical"
          initialValues={{
            enableSchema: true,
            schemaOrgName: "MocPhim",
            schemaLogo: "https://mocphim.vn/logo.png",
            enableBreadcrumbSchema: true,
            enableMovieSchema: true,
            enableVideoSchema: true,
          }}
          onFinish={async (values) => {
            console.log(values);
            message.success("Đã lưu cấu hình schema rich results");
          }}
          submitter={{ searchConfig: { submitText: "Lưu schema" } }}
        >
          <ProFormSwitch name="enableSchema" label="Bật JSON-LD schema toàn site" />
          <ProFormText name="schemaOrgName" label="Tên tổ chức (Organization)" rules={[{ required: true }]} />
          <ProFormText name="schemaLogo" label="Logo URL cho schema" rules={[{ type: "url", message: "URL không hợp lệ" }]} />
          <ProFormSwitch name="enableBreadcrumbSchema" label="Bật BreadcrumbList" />
          <ProFormSwitch name="enableMovieSchema" label="Bật Movie / TVSeries schema" />
          <ProFormSwitch name="enableVideoSchema" label="Bật VideoObject schema" />
        </ProForm>

        <ProTable<SchemaProfile>
          style={{ marginTop: 16 }}
          rowKey="id"
          columns={schemaColumns}
          request={async () => ({ data: mockSchemaProfiles, success: true, total: mockSchemaProfiles.length })}
          pagination={{ pageSize: 6 }}
          search={false}
        />
      </ProCard>

      <ProCard title="Danh sách URL ưu tiên index" bordered style={{ marginTop: 16 }}>
        <ProTable<IndexUrl>
          rowKey="id"
          columns={indexColumns}
          request={async () => ({ data: mockIndexUrls, success: true, total: mockIndexUrls.length })}
          pagination={{ pageSize: 8 }}
        />
      </ProCard>
    </PageContainer>
  );
}
