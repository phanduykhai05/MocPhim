"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ProLayout, DefaultFooter } from "@ant-design/pro-components";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  TagsOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Dropdown, Badge, App } from "antd";
import viVN from "antd/locale/vi_VN";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const route = {
    path: "/admin",
    routes: [
      {
        path: "/admin/dashboard",
        name: "Tổng quan",
        icon: <DashboardOutlined />,
      },
      {
        path: "/admin/noi-dung",
        key: "noi-dung",
        name: "Nội dung",
        icon: <VideoCameraOutlined />,
        routes: [
          {
            path: "/admin/phim",
            name: "Quản lý Phim",
            icon: <VideoCameraOutlined />,
          },
          {
            path: "/admin/the-loai",
            name: "Thể loại",
            icon: <TagsOutlined />,
          },
          {
            path: "/admin/binh-luan",
            name: "Bình luận",
            icon: <CommentOutlined />,
          },
        ],
      },
      {
        path: "/admin/nguoi-dung",
        name: "Người dùng",
        icon: <UserOutlined />,
      },
      {
        path: "/admin/cai-dat",
        name: "Cài đặt",
        icon: <SettingOutlined />,
      },
    ],
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <ConfigProvider locale={viVN}>
      <App>
        <div style={{ height: "100vh" }}>
          <ProLayout
            title="MocPhim Admin"
            logo="https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg"
            route={route}
            location={{ pathname }}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            siderWidth={216}
            layout="mix"
            splitMenus={false}
            fixSiderbar
            fixedHeader
            menuItemRender={(item, dom) => (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  if (item.path && !item.routes?.length) router.push(item.path);
                }}
                href={item.path}
              >
                {dom}
              </a>
            )}
            avatarProps={{
              src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
              size: "small",
              title: "Admin",
              render: (_props, dom) => (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "profile",
                        label: "Trang cá nhân",
                        icon: <UserOutlined />,
                      },
                      { type: "divider" },
                      {
                        key: "logout",
                        label: "Đăng xuất",
                        icon: <LogoutOutlined />,
                        danger: true,
                        onClick: () => router.push("/"),
                      },
                    ],
                  }}
                >
                  {dom}
                </Dropdown>
              ),
            }}
            actionsRender={() => [
              <Badge count={5} size="small" key="notification">
                <BellOutlined
                  style={{ fontSize: 16, cursor: "pointer", color: "inherit" }}
                />
              </Badge>,
            ]}
            footerRender={() => (
              <DefaultFooter
                copyright={`${new Date().getFullYear()} MocPhim`}
                links={[
                  { key: "home", title: "Trang chủ", href: "/", blankTarget: true },
                ]}
              />
            )}
          >
            {children}
          </ProLayout>
        </div>
      </App>
    </ConfigProvider>
  );
}
