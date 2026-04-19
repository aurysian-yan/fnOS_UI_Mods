import {
  Button,
  Card,
  Code,
  HStack,
  Image,
  Input,
  Stack,
  Text
} from "@chakra-ui/react";
import {
  BracketsCurly,
  Globe,
  ImageSquare,
  Palette,
  SquaresFour,
  TextAa
} from "@phosphor-icons/react";
import {
  CheckboxRow,
  FormField,
  RadioCardGroup,
  SelectField,
  SwitchRow,
  TextAreaField,
  TextInputField
} from "./FormControls";
import { SectionCard } from "./SectionCard";
import type {
  CustomCodeSettings,
  DesktopIconLayoutMode,
  FontSettings,
  LaunchpadItem,
  LaunchpadStyle,
  TitlebarStyle
} from "../types";

interface GeneralSectionProps {
  disabled: boolean;
  siteEnabled: boolean;
  autoEnableSuspectedFnOS: boolean;
  onSiteEnabledChange: (checked: boolean) => void;
  onAutoEnableChange: (checked: boolean) => void;
}

export function GeneralSection(props: GeneralSectionProps) {
  return (
    <SectionCard
      title="站点注入"
      description="控制当前站点和疑似 fnOS 页面是否自动启用。"
      icon={<Globe size={18} weight="duotone" />}
    >
      <SwitchRow
        title="为当前站点启用"
        checked={props.siteEnabled}
        disabled={props.disabled}
        onChange={props.onSiteEnabledChange}
      />
      <SwitchRow
        title="自动对疑似 fnOS 页面启用"
        checked={props.autoEnableSuspectedFnOS}
        disabled={props.disabled}
        onChange={props.onAutoEnableChange}
      />
    </SectionCard>
  );
}

interface AppearanceSectionProps {
  disabled: boolean;
  brandColor: string;
  basePresetEnabled: boolean;
  windowAnimationBlurEnabled: boolean;
  titlebarStyle: TitlebarStyle;
  launchpadStyle: LaunchpadStyle;
  desktopIconLayoutEnabled: boolean;
  desktopIconLayoutMode: DesktopIconLayoutMode;
  desktopIconPerColumn: number;
  onBasePresetEnabledChange: (checked: boolean) => void;
  onBrandColorPreview: (value: string) => void;
  onBrandColorCommit: (value: string) => void;
  onResetBrandColor: () => void;
  onWindowAnimationBlurEnabledChange: (checked: boolean) => void;
  onTitlebarStyleChange: (value: TitlebarStyle) => void;
  onLaunchpadStyleChange: (value: LaunchpadStyle) => void;
  onDesktopIconLayoutEnabledChange: (checked: boolean) => void;
  onDesktopIconLayoutModeChange: (value: DesktopIconLayoutMode) => void;
  onDesktopIconPerColumnChange: (value: string) => void;
  onDesktopIconPerColumnCommit: () => void;
  showMasterSwitch?: boolean;
}

export function AppearanceSection(props: AppearanceSectionProps) {
  return (
    <SectionCard
      title="基础外观"
      description="主题色、标题栏、启动台和桌面图标布局。"
      icon={<Palette size={18} weight="duotone" />}
    >
      {props.showMasterSwitch !== false ? (
        <SwitchRow
          title="基础美化预设"
          description="关闭后不应用主题色、标题栏样式和启动台样式。"
          checked={props.basePresetEnabled}
          disabled={props.disabled}
          onChange={props.onBasePresetEnabledChange}
        />
      ) : null}

      <FormField label="主题色" hint="亮度自动限制在 30% 到 70% 之间。">
        <HStack align="center" gap="3">
          <Input
            type="color"
            value={props.brandColor}
            maxW="14"
            h="10"
            p="1"
            disabled={props.disabled}
            onInput={(event) => props.onBrandColorPreview(event.currentTarget.value)}
            onChange={(event) => props.onBrandColorCommit(event.currentTarget.value)}
          />
          <Code flex="1" px="3" py="2">
            {props.brandColor}
          </Code>
          <Button size="sm" variant="ghost" onClick={props.onResetBrandColor} disabled={props.disabled}>
            重置
          </Button>
        </HStack>
      </FormField>

      <SwitchRow
        title="窗口动画模糊"
        description="关闭可降低动画性能开销。"
        checked={props.windowAnimationBlurEnabled}
        disabled={props.disabled}
        onChange={props.onWindowAnimationBlurEnabledChange}
      />

      <Stack gap="3">
        <Text fontWeight="medium">标题栏样式</Text>
        <RadioCardGroup
          name="titlebarStyle"
          value={props.titlebarStyle}
          disabled={props.disabled || !props.basePresetEnabled}
          onChange={props.onTitlebarStyleChange}
          options={[
            {
              value: "windows",
              title: "Windows 标题栏",
              description: "标题左对齐，控制按钮位于右侧。"
            },
            {
              value: "mac",
              title: "macOS 标题栏",
              description: "标题居中，红绿灯按钮位于左侧。"
            }
          ]}
        />
      </Stack>

      <Stack gap="3">
        <Text fontWeight="medium">启动台样式</Text>
        <RadioCardGroup
          name="launchpadStyle"
          value={props.launchpadStyle}
          disabled={props.disabled || !props.basePresetEnabled}
          onChange={props.onLaunchpadStyleChange}
          options={[
            {
              value: "classic",
              title: "经典启动台",
              description: "传统图标布局和交互。"
            },
            {
              value: "spotlight",
              title: "Spotlight 启动台",
              description: "强调搜索面板和聚焦式布局。"
            }
          ]}
        />
      </Stack>

      <SwitchRow
        title="桌面图标优化"
        description="优化桌面图标布局和悬停反馈。"
        checked={props.desktopIconLayoutEnabled}
        disabled={props.disabled}
        onChange={props.onDesktopIconLayoutEnabledChange}
      />

      <SelectField
        label="桌面图标布局"
        value={props.desktopIconLayoutMode}
        disabled={props.disabled || !props.desktopIconLayoutEnabled}
        options={[
          { label: "自适应", value: "adaptive" },
          { label: "固定网格", value: "fixed" }
        ]}
        onChange={(value) => props.onDesktopIconLayoutModeChange(value as DesktopIconLayoutMode)}
      />

      <TextInputField
        label="固定网格每列数量"
        hint="仅固定网格模式下生效，范围 4 到 16。"
        value={String(props.desktopIconPerColumn)}
        disabled={
          props.disabled ||
          !props.desktopIconLayoutEnabled ||
          props.desktopIconLayoutMode !== "fixed"
        }
        onChange={props.onDesktopIconPerColumnChange}
        onCommit={props.onDesktopIconPerColumnCommit}
      />
    </SectionCard>
  );
}

interface LaunchpadSectionProps {
  disabled: boolean;
  enabled: boolean;
  items: LaunchpadItem[];
  status: string;
  scaleSelected: string[];
  maskOnlySelected: string[];
  redrawSelected: string[];
  onEnabledChange: (checked: boolean) => void;
  onToggleScale: (key: string, checked: boolean) => void;
  onToggleMaskOnly: (key: string, checked: boolean) => void;
  onToggleRedraw: (key: string, checked: boolean) => void;
  showMasterSwitch?: boolean;
}

export function LaunchpadSection(props: LaunchpadSectionProps) {
  const scaleSelectedSet = new Set(props.scaleSelected);
  const maskOnlySelectedSet = new Set(props.maskOnlySelected);
  const redrawSelectedSet = new Set(props.redrawSelected);

  return (
    <SectionCard
      title="启动台图标"
      description="统一异形图标的视觉表现，可选缩放、蒙版和重绘。"
      icon={<SquaresFour size={18} weight="duotone" />}
    >
      {props.showMasterSwitch !== false ? (
        <SwitchRow
          title="完美图标"
          description="启用后会对选中的启动台图标进行额外处理。"
          checked={props.enabled}
          disabled={props.disabled}
          onChange={props.onEnabledChange}
        />
      ) : null}

      <Text color="fg.muted" textStyle="sm">
        {props.status}
      </Text>

      {props.items.length ? (
        <Stack gap="3">
          {props.items.map((item) => (
            <Card.Root key={item.key} variant="outline" size="sm">
              <Card.Body gap="3">
                <HStack align="center" gap="3">
                  {item.iconSrc ? (
                    <Image
                      src={item.iconSrc}
                      alt=""
                      boxSize="8"
                      borderRadius="md"
                      objectFit="contain"
                    />
                  ) : (
                    <HStack
                      boxSize="8"
                      justify="center"
                      borderWidth="1px"
                      borderRadius="md"
                      color="fg.muted"
                    >
                      <SquaresFour size={16} />
                    </HStack>
                  )}

                  <Stack gap="1" minW="0" flex="1">
                    <Text fontWeight="medium" lineClamp={1}>
                      {item.title}
                    </Text>
                    <Code
                      fontSize="2xs"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {item.key}
                    </Code>
                  </Stack>
                </HStack>

                <HStack gap="4" wrap="wrap">
                  <CheckboxRow
                    label="缩放"
                    checked={scaleSelectedSet.has(item.key)}
                    disabled={props.disabled}
                    onChange={(checked) => props.onToggleScale(item.key, checked)}
                  />
                  <CheckboxRow
                    label="蒙版"
                    checked={maskOnlySelectedSet.has(item.key)}
                    disabled={props.disabled}
                    onChange={(checked) => props.onToggleMaskOnly(item.key, checked)}
                  />
                  <HStack title={item.redrawHint}>
                    <CheckboxRow
                      label="重绘"
                      checked={redrawSelectedSet.has(item.key)}
                      disabled={props.disabled || !item.redrawAvailable}
                      onChange={(checked) => props.onToggleRedraw(item.key, checked)}
                    />
                  </HStack>
                </HStack>
              </Card.Body>
            </Card.Root>
          ))}
        </Stack>
      ) : (
        <Card.Root variant="outline">
          <Card.Body>
            <Text color="fg.muted" textStyle="sm">
              暂无数据
            </Text>
          </Card.Body>
        </Card.Root>
      )}
    </SectionCard>
  );
}

interface FontSectionProps {
  disabled: boolean;
  settings: FontSettings;
  onSettingsChange: (patch: Partial<FontSettings>) => void;
  onCommit: () => void;
  showMasterSwitch?: boolean;
}

export function FontSection(props: FontSectionProps) {
  return (
    <SectionCard
      title="字体替换"
      description="替换 UI 字体，并支持等宽字体、字重和 OpenType 属性。"
      icon={<TextAa size={18} weight="duotone" />}
    >
      {props.showMasterSwitch !== false ? (
        <SwitchRow
          title="启用字体替换"
          checked={props.settings.enabled}
          disabled={props.disabled}
          onChange={(checked) => {
            props.onSettingsChange({ enabled: checked });
            props.onCommit();
          }}
        />
      ) : null}
      <TextInputField
        label="本地字体名称"
        value={props.settings.family}
        placeholder='"MiSans VF", "Segoe UI", sans-serif'
        disabled={props.disabled || !props.settings.enabled}
        onChange={(value) => props.onSettingsChange({ family: value })}
        onCommit={props.onCommit}
      />
      <TextInputField
        label="等宽字体名称"
        value={props.settings.monospaceFamily}
        placeholder='"Maple Mono", "Cascadia Mono", monospace'
        disabled={props.disabled || !props.settings.enabled}
        onChange={(value) => props.onSettingsChange({ monospaceFamily: value })}
        onCommit={props.onCommit}
      />
      <TextInputField
        label="网络字体 URL"
        type="url"
        value={props.settings.url}
        placeholder="https://example.com/font.woff2"
        disabled={props.disabled || !props.settings.enabled}
        onChange={(value) => props.onSettingsChange({ url: value })}
        onCommit={props.onCommit}
      />
      <TextInputField
        label="字重"
        value={props.settings.weight}
        placeholder="450 / normal / 600"
        disabled={props.disabled || !props.settings.enabled}
        onChange={(value) => props.onSettingsChange({ weight: value })}
        onCommit={props.onCommit}
      />
      <TextInputField
        label="OpenType 属性"
        value={props.settings.featureSettings}
        placeholder='"liga" 1, "kern" 1'
        disabled={props.disabled || !props.settings.enabled}
        onChange={(value) => props.onSettingsChange({ featureSettings: value })}
        onCommit={props.onCommit}
      />
    </SectionCard>
  );
}

interface LoginSectionProps {
  disabled: boolean;
  status: string;
  username: string;
  onWallpaperUpload: (file: File | null) => void;
  onWallpaperClear: () => void;
  onUsernameChange: (value: string) => void;
  onUsernameCommit: () => void;
}

export function LoginSection(props: LoginSectionProps) {
  return (
    <SectionCard
      title="登录页"
      description="自定义登录页壁纸，并支持默认用户名自动填充。"
      icon={<ImageSquare size={18} weight="duotone" />}
    >
      <FormField label="导入本地图片" hint={props.status}>
        <Stack gap="3">
          <Input
            type="file"
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            disabled={props.disabled}
            onChange={(event) => {
              props.onWallpaperUpload(event.currentTarget.files?.[0] ?? null);
              event.currentTarget.value = "";
            }}
          />
          <Button variant="outline" onClick={props.onWallpaperClear} disabled={props.disabled}>
            恢复默认壁纸
          </Button>
        </Stack>
      </FormField>

      <TextInputField
        label="登录默认用户名"
        hint="启用后会隐藏用户名输入框，并提供“切换账户”按钮恢复手动输入。"
        value={props.username}
        disabled={props.disabled}
        onChange={props.onUsernameChange}
        onCommit={props.onUsernameCommit}
      />
    </SectionCard>
  );
}

interface CustomCodeSectionProps {
  disabled: boolean;
  settings: CustomCodeSettings;
  status: string;
  onSettingsChange: (patch: Partial<CustomCodeSettings>) => void;
  onCommit: () => void;
  showMasterSwitch?: boolean;
}

export function CustomCodeSection(props: CustomCodeSectionProps) {
  return (
    <SectionCard
      title="自定义代码"
      description="向页面注入自定义 CSS / JavaScript。"
      icon={<BracketsCurly size={18} weight="duotone" />}
    >
      {props.showMasterSwitch !== false ? (
        <SwitchRow
          title="启用自定义代码"
          checked={props.settings.enabled}
          disabled={props.disabled}
          onChange={(checked) => {
            props.onSettingsChange({ enabled: checked });
            props.onCommit();
          }}
        />
      ) : null}
      <TextAreaField
        label="自定义 CSS"
        value={props.settings.css}
        placeholder=".semi-button { border-radius: 999px !important; }"
        disabled={props.disabled || !props.settings.enabled}
        onChange={(value) => props.onSettingsChange({ css: value })}
        onCommit={props.onCommit}
      />
      <TextAreaField
        label="自定义 JavaScript"
        value={props.settings.js}
        placeholder="console.log('FnOS custom js loaded');"
        disabled={props.disabled || !props.settings.enabled}
        onChange={(value) => props.onSettingsChange({ js: value })}
        onCommit={props.onCommit}
      />
      <Text color="fg.muted" textStyle="sm">
        {props.status}
      </Text>
    </SectionCard>
  );
}
