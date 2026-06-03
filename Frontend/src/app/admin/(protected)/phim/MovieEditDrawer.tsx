"use client";

import { useEffect } from "react";
import {
  Drawer, Form, Input, Select, InputNumber,
  Switch, Button, Space, App, Image, Divider,
} from "antd";
import { type MovieSyncItem, type UpdateMoviePayload, updateMovie } from "@/lib/api/sync";
import { getMovieThumb } from "@/lib/api/movie";

const { Option } = Select;

interface Props {
  movie: MovieSyncItem | null;
  open: boolean;
  onClose: () => void;
  onSaved: (updated: MovieSyncItem) => void;
}

const TYPE_OPTIONS = [
  { value: "single",   label: "Phim lẻ" },
  { value: "series",   label: "Phim bộ" },
  { value: "hoathinh", label: "Hoạt hình" },
  { value: "tvshows",  label: "TV Shows" },
];

const QUALITY_OPTIONS = ["HD", "FHD", "SD", "CAM", "4K"];
const LANG_OPTIONS    = ["Vietsub", "Thuyết minh", "Lồng tiếng", "Vietsub + Thuyết minh"];

export default function MovieEditDrawer({ movie, open, onClose, onSaved }: Props) {
  const [form] = Form.useForm<UpdateMoviePayload>();
  const { message } = App.useApp();

  useEffect(() => {
    if (movie) {
      form.setFieldsValue({
        title:          movie.title,
        originName:     movie.originName,
        type:           movie.type,
        quality:        movie.quality,
        lang:           movie.lang,
        year:           movie.year,
        episodeCurrent: movie.episodeCurrent,
        duration:       movie.duration,
        thumbUrl:       movie.thumbUrl,
        posterUrl:      movie.posterUrl,
        subDocquyen:    movie.subDocquyen ?? false,
      });
    }
  }, [movie, form]);

  async function handleSave() {
    if (!movie) return;
    try {
      const values = await form.validateFields();
      const result = await updateMovie(movie.slug, values);
      if (!result) { message.error("Cập nhật thất bại"); return; }
      message.success("Đã lưu thành công");
      onSaved({ ...movie, ...values });
      onClose();
    } catch (err: any) {
      if (err?.errorFields) return; // validation error
      message.error("Có lỗi xảy ra");
    }
  }

  const thumbSrc = movie?.thumbUrl
    ? (movie.thumbUrl.startsWith("http") ? movie.thumbUrl : getMovieThumb(movie.thumbUrl))
    : undefined;

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {thumbSrc && (
            <Image
              src={thumbSrc}
              width={32}
              height={44}
              style={{ objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
              alt=""
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />
          )}
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{movie?.title ?? "Chỉnh sửa phim"}</div>
            {movie?.originName && (
              <div style={{ fontSize: 12, color: "#8c8c8c", fontWeight: 400 }}>{movie.originName}</div>
            )}
          </div>
        </div>
      }
      placement="right"
      width={520}
      open={open}
      onClose={onClose}
      styles={{
        body: { paddingBottom: 80 },
        mask: { backdropFilter: "blur(2px)" },
      }}
      extra={
        <Space>
          <Button onClick={onClose}>Huỷ</Button>
          <Button type="primary" onClick={handleSave}>Lưu</Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Divider orientation="left" plain style={{ fontSize: 13, color: "#8c8c8c" }}>Thông tin cơ bản</Divider>

        <Form.Item label="Tên phim (tiếng Việt)" name="title" rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}>
          <Input placeholder="Nhập tên phim..." />
        </Form.Item>

        <Form.Item label="Tên gốc" name="originName">
          <Input placeholder="Tên phim gốc..." />
        </Form.Item>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Form.Item label="Loại phim" name="type">
            <Select placeholder="Chọn loại">
              {TYPE_OPTIONS.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="Năm" name="year">
            <InputNumber style={{ width: "100%" }} min={1900} max={2100} placeholder="2024" />
          </Form.Item>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Form.Item label="Chất lượng" name="quality">
            <Select placeholder="Chọn chất lượng">
              {QUALITY_OPTIONS.map(v => <Option key={v} value={v}>{v}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="Ngôn ngữ" name="lang">
            <Select placeholder="Chọn ngôn ngữ">
              {LANG_OPTIONS.map(v => <Option key={v} value={v}>{v}</Option>)}
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Form.Item label="Tập hiện tại" name="episodeCurrent">
            <Input placeholder="Vd: Tập 12, Full..." />
          </Form.Item>

          <Form.Item label="Thời lượng" name="duration">
            <Input placeholder="Vd: 45 Phút, 1h30m..." />
          </Form.Item>
        </div>

        <Form.Item label="Độc quyền (Sub Docquyen)" name="subDocquyen" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Divider orientation="left" plain style={{ fontSize: 13, color: "#8c8c8c" }}>Hình ảnh</Divider>

        <Form.Item label="URL Thumbnail" name="thumbUrl">
          <Input placeholder="ten-phim-thumb.jpg hoặc https://..." />
        </Form.Item>

        <Form.Item label="URL Poster" name="posterUrl">
          <Input placeholder="ten-phim-poster.jpg hoặc https://..." />
        </Form.Item>

        {/* Preview */}
        {thumbSrc && (
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <div>
              <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4 }}>Thumbnail hiện tại</div>
              <Image
                src={thumbSrc}
                width={80}
                style={{ objectFit: "cover", borderRadius: 6 }}
                alt="thumb"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              />
            </div>
          </div>
        )}
      </Form>
    </Drawer>
  );
}
