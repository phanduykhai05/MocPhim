import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../entities/user.entity';
import { SeoConfig } from '../../entities/seo-config.entity';
import { ApiResponse } from '../../common/dto/api-response.dto';

const CONFIG_ID = 'global';

const DEFAULT_SETTINGS = {
  meta: {
    siteTitle: 'MocPhim - Xem phim online miễn phí',
    titleTemplate: '%s | MocPhim',
    defaultDescription: 'MocPhim cung cấp phim online chất lượng cao, cập nhật nhanh liên tục.',
    defaultKeywords: 'xem phim, phim online, phim vietsub, phim moi',
    canonicalDomain: 'https://moc-phim.vercel.app',
    defaultRobotsMeta: 'index,follow,max-image-preview:large',
    autoCanonical: true,
    autoOpenGraph: true,
    autoTwitterCard: true,
  },
  sitemap: {
    enableSitemap: true,
    includeImageSitemap: false,
    includeVideoSitemap: false,
    sitemapSplitSize: '5000',
    pingSearchEngine: true,
  },
  robots: {
    robotsMode: 'custom',
    robotsTxt:
      'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nSitemap: https://moc-phim.vercel.app/sitemap.xml',
  },
  urlOptimization: {
    urlPatternMovie: '/phim/{slug}',
    urlPatternEpisode: '/xem-phim/{slug}-{episode}',
    forceLowercaseSlug: true,
    removeStopWords: true,
    maxSlugLength: '80',
    redirectOldSlug: true,
  },
  schema: {
    enableSchema: true,
    schemaOrgName: 'MocPhim',
    schemaLogo: 'https://moc-phim.vercel.app/logo.png',
    enableBreadcrumbSchema: true,
    enableMovieSchema: true,
    enableVideoSchema: true,
  },
};

@ApiTags('SEO')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('api/v1/admin/seo')
export class SeoController {
  constructor(@InjectRepository(SeoConfig) private repo: Repository<SeoConfig>) {}

  @Get('settings')
  @ApiOperation({ summary: '[Admin] Lấy toàn bộ cấu hình SEO' })
  async getSettings() {
    let config = await this.repo.findOne({ where: { id: CONFIG_ID } });
    if (!config) {
      config = this.repo.create({ id: CONFIG_ID, settings: DEFAULT_SETTINGS });
      await this.repo.save(config);
    }
    const merged = { ...DEFAULT_SETTINGS, ...config.settings };
    return ApiResponse.ok({ settings: merged, updatedAt: config.updatedAt });
  }

  @Put('settings')
  @ApiOperation({ summary: '[Admin] Lưu cấu hình SEO (merge từng section)' })
  async saveSettings(@Body() body: { section: string; data: Record<string, unknown> }) {
    let config = await this.repo.findOne({ where: { id: CONFIG_ID } });
    if (!config) {
      config = this.repo.create({ id: CONFIG_ID, settings: { ...DEFAULT_SETTINGS } });
    }
    const current = (config.settings ?? {}) as Record<string, unknown>;
    config.settings = { ...current, [body.section]: { ...(current[body.section] as object ?? {}), ...body.data } };
    await this.repo.save(config);
    return ApiResponse.ok({ settings: config.settings }, 'Đã lưu cấu hình SEO');
  }

  @Get('robots')
  @ApiOperation({ summary: '[Public] Nội dung robots.txt từ config' })
  async getRobots() {
    const config = await this.repo.findOne({ where: { id: CONFIG_ID } });
    const settings = (config?.settings ?? DEFAULT_SETTINGS) as typeof DEFAULT_SETTINGS;
    const robotsTxt = settings.robots?.robotsTxt ?? DEFAULT_SETTINGS.robots.robotsTxt;
    return ApiResponse.ok({ robotsTxt });
  }
}

// ── Public controller — no auth required ─────────────────────────────────────

@ApiTags('SEO')
@Controller('api/v1/seo')
export class PublicSeoController {
  constructor(@InjectRepository(SeoConfig) private repo: Repository<SeoConfig>) {}

  @Get('meta')
  @ApiOperation({ summary: '[Public] Meta settings để render <head> toàn site' })
  async getPublicMeta() {
    const config = await this.repo.findOne({ where: { id: CONFIG_ID } });
    const s = { ...DEFAULT_SETTINGS, ...(config?.settings ?? {}) } as typeof DEFAULT_SETTINGS;
    return ApiResponse.ok({
      siteTitle:          s.meta.siteTitle,
      titleTemplate:      s.meta.titleTemplate,
      defaultDescription: s.meta.defaultDescription,
      defaultKeywords:    s.meta.defaultKeywords,
      canonicalDomain:    s.meta.canonicalDomain,
      defaultRobotsMeta:  s.meta.defaultRobotsMeta,
      autoOpenGraph:      s.meta.autoOpenGraph,
      autoTwitterCard:    s.meta.autoTwitterCard,
      schemaOrgName:      s.schema.schemaOrgName,
      schemaLogo:         s.schema.schemaLogo,
      enableSchema:       s.schema.enableSchema,
    });
  }
}
