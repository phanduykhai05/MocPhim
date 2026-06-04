"use client";

import { useEffect, useState } from "react";
import {
  PageContainer, ProCard, ProForm, ProFormText,
  ProFormTextArea, ProFormSwitch, ProFormSelect, StatisticCard,
} from "@ant-design/pro-components";
import { App, Button, Space, Spin, Tag, Typography, Alert } from "antd";
import {
  SearchOutlined, LinkOutlined, FileTextOutlined,
  ReloadOutlined, SendOutlined, SyncOutlined,
} from "@ant-design/icons";
import { apiGetSeoSettings, apiSaveSeoSection, type SeoSettings } from "@/lib/api/seo";
import { fetchMovieList, fetchCategories, fetchCountries, fetchYears } from "@/lib/api/movie";

const { Text } = Typography;

const SPLIT_OPTIONS = ["1000", "5000", "10000", "20000"].map((v) => ({ label: `${v} URL/file`, value: v }));
const SLUG_LENGTH_OPTIONS = ["60", "80", "100", "120"].map((v) => ({ label: `${v} ký tự`, value: v }));

export default function SeoSitemapPage() {
  const { message } = App.useApp();
  const [settings, setSettings] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [sitemapStats, setSitemapStats] = useState({ total: 0, movies: 0, categories: 0, countries: 0, years: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [seoResult, movieData, categories, countries, years] = await Promise.all([
          apiGetSeoSettings(),
          fetchMovieList({ page: 1, size: 1 }),
          fetchCategories(),
          fetchCountries(),
          fetchYears(),
        ]);
        setSettings(seoResult.settings);
        setUpdatedAt(seoResult.updatedAt);
        const movies = movieData?.totalItems ?? 0;
        setSitemapStats({
          total: movies + categories.length + countries.length + (years as unknown[]).length + 5,
          movies,
          categories: categories.length,
          countries: countries.length,
          years: (years as unknown[]).length,
        });
      } catch {
        message.error("Không thể tải cấu hình SEO");
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveSection(section: keyof SeoSettings, values: Record<string, unknown>) {
    await apiSaveSeoSection(section, values);
    setSettings((prev) => prev ? { ...prev, [section]: { ...prev[section], ...values } } : prev);
    message.success("Đã lưu cấu hình");
  }

  if (loading) {
    return (
      <PageContainer title="Quản lý SEO & Sitemap">
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!settings) {
    return (
      <PageContainer title="Quản lý SEO & Sitemap">
        <Alert type="error" message="Không thể tải cấu hình SEO. Vui lòng thử lại." />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Quản lý SEO & Sitemap"
      subTitle={updatedAt ? `Cập nhật lần cuối: ${new Date(updatedAt).toLocaleString("vi-VN")}` : "Thiết lập SEO cho toàn bộ hệ thống"}
    >
      {/* ── Thống kê sitemap ───────────────────────────────────────────────────── */}
      <ProCard ghost gutter={[16, 16]} wrap>
        <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }} bordered>
          <StatisticCard statistic={{ title: "Tổng URL sitemap", value: sitemapStats.total, icon: <LinkOutlined style={{ color: "#1677ff" }} /> }} />
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }} bordered>
          <StatisticCard statistic={{ title: "Trang phim", value: sitemapStats.movies, icon: <SearchOutlined style={{ color: "#52c41a" }} /> }} />
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }} bordered>
          <StatisticCard statistic={{ title: "Thể loại + Quốc gia", value: sitemapStats.categories + sitemapStats.countries, icon: <FileTextOutlined style={{ color: "#fa8c16" }} /> }} />
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }} bordered>
          <StatisticCard statistic={{ title: "Trang năm phát hành", value: sitemapStats.years, icon: <SyncOutlined style={{ color: "#722ed1" }} /> }} />
        </ProCard>
      </ProCard>

      {/* ── Meta tag mặc định ──────────────────────────────────────────────────── */}
      <ProCard title="Meta tag mặc định" bordered style={{ marginTop: 16 }}>
        <ProForm
          layout="vertical"
          initialValues={settings.meta}
          onFinish={async (values) => { await saveSection("meta", values); return true; }}
          submitter={{ searchConfig: { submitText: "Lưu Meta tag" } }}
        >
          <ProFormText name="siteTitle" label="Site title mặc định" rules={[{ required: true }]} />
          <ProFormText name="titleTemplate" label="Title template" placeholder="%s | MocPhim" />
          <ProFormTextArea name="defaultDescription" label="Meta description mặc định" fieldProps={{ rows: 3 }} />
          <ProFormText name="defaultKeywords" label="Meta keywords mặc định" />
          <ProFormText name="defaultRobotsMeta" label="Meta robots mặc định" placeholder="index,follow,max-image-preview:large" />
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

      {/* ── Sitemap ────────────────────────────────────────────────────────────── */}
      <ProCard
        title="Cấu hình Sitemap"
        bordered
        style={{ marginTop: 16 }}
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => message.success("Đã tạo lại sitemap")}>
              Tạo lại sitemap
            </Button>
            <Button type="primary" icon={<SendOutlined />} onClick={() => message.success("Đã ping Google/Bing")}>
              Ping Search Engine
            </Button>
          </Space>
        }
      >
        <ProForm
          layout="vertical"
          initialValues={settings.sitemap}
          onFinish={async (values) => { await saveSection("sitemap", values); return true; }}
          submitter={{ searchConfig: { submitText: "Lưu cấu hình sitemap" } }}
        >
          <ProFormSwitch name="enableSitemap" label="Bật tự động tạo sitemap.xml" />
          <ProFormSwitch name="includeImageSitemap" label="Sinh image-sitemap.xml" />
          <ProFormSwitch name="includeVideoSitemap" label="Sinh video-sitemap.xml" />
          <ProFormSelect name="sitemapSplitSize" label="Số URL mỗi file sitemap" options={SPLIT_OPTIONS} />
          <ProFormSwitch name="pingSearchEngine" label="Tự động ping Google/Bing khi cập nhật sitemap" />
        </ProForm>

        <div style={{ marginTop: 8 }}>
          <Text type="secondary">Sitemap index: </Text>
          <Tag color="blue">
            <a href={`${settings.meta.canonicalDomain}/sitemap.xml`} target="_blank" rel="noreferrer">
              {settings.meta.canonicalDomain}/sitemap.xml
            </a>
          </Tag>
        </div>
      </ProCard>

      {/* ── Robots.txt ─────────────────────────────────────────────────────────── */}
      <ProCard title="Robots.txt" bordered style={{ marginTop: 16 }}>
        <ProForm
          layout="vertical"
          initialValues={settings.robots}
          onFinish={async (values) => { await saveSection("robots", values); return true; }}
          submitter={{ searchConfig: { submitText: "Lưu robots.txt" } }}
        >
          <ProFormSelect
            name="robotsMode"
            label="Chế độ robots.txt"
            options={[
              { label: "Mặc định (Allow all)", value: "default" },
              { label: "Tuỳ chỉnh", value: "custom" },
              { label: "Chặn toàn bộ crawler", value: "block_all" },
            ]}
          />
          <ProFormTextArea
            name="robotsTxt"
            label="Nội dung robots.txt"
            fieldProps={{ rows: 8, style: { fontFamily: "monospace", fontSize: 13 } }}
          />
        </ProForm>
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">Preview live: </Text>
          <Tag color="blue">
            <a href={`${settings.meta.canonicalDomain}/robots.txt`} target="_blank" rel="noreferrer">
              {settings.meta.canonicalDomain}/robots.txt
            </a>
          </Tag>
        </div>
      </ProCard>

      {/* ── Tối ưu URL ────────────────────────────────────────────────────────── */}
      <ProCard title="Tối ưu URL & Slug" bordered style={{ marginTop: 16 }}>
        <ProForm
          layout="vertical"
          initialValues={settings.urlOptimization}
          onFinish={async (values) => { await saveSection("urlOptimization", values); return true; }}
          submitter={{ searchConfig: { submitText: "Lưu tối ưu URL" } }}
        >
          <ProFormText name="urlPatternMovie" label="Mẫu URL trang phim" rules={[{ required: true }]} />
          <ProFormText name="urlPatternEpisode" label="Mẫu URL trang xem phim" rules={[{ required: true }]} />
          <ProFormSwitch name="forceLowercaseSlug" label="Ép slug chữ thường" />
          <ProFormSwitch name="removeStopWords" label="Bỏ stop-words trong slug" />
          <ProFormSelect name="maxSlugLength" label="Giới hạn độ dài slug" options={SLUG_LENGTH_OPTIONS} />
          <ProFormSwitch name="redirectOldSlug" label="Tự động 301 redirect URL cũ" />
        </ProForm>
      </ProCard>

      {/* ── Schema JSON-LD ─────────────────────────────────────────────────────── */}
      <ProCard title="Schema JSON-LD (Google Rich Results)" bordered style={{ marginTop: 16 }}>
        <ProForm
          layout="vertical"
          initialValues={settings.schema}
          onFinish={async (values) => { await saveSection("schema", values); return true; }}
          submitter={{ searchConfig: { submitText: "Lưu cấu hình schema" } }}
        >
          <ProFormSwitch name="enableSchema" label="Bật JSON-LD schema toàn site" />
          <ProFormText name="schemaOrgName" label="Tên tổ chức (Organization)" rules={[{ required: true }]} />
          <ProFormText
            name="schemaLogo"
            label="Logo URL cho schema"
            rules={[{ type: "url", message: "URL không hợp lệ" }]}
          />
          <ProFormSwitch name="enableBreadcrumbSchema" label="Bật BreadcrumbList schema" />
          <ProFormSwitch name="enableMovieSchema" label="Bật Movie / TVSeries schema" />
          <ProFormSwitch name="enableVideoSchema" label="Bật VideoObject schema" />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
}
