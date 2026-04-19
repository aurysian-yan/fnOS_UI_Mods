import { Alert, Box, Stack, Text } from "@chakra-ui/react";
import { useCanGoBack, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  CaretLeftIcon,
  BracketsCurly,
  ImageSquare,
  Info,
  Palette,
  SquaresFour,
  TextAa
} from "@phosphor-icons/react";
import BlurEffect from "react-progressive-blur";
import { startTransition, useEffect, useRef, useState, type ReactNode, type UIEvent } from "react";
import { PopupHeader } from "./components/PopupHeader";
import { SettingsEntryCard } from "./components/SettingsEntryCard";
import { UpdatePanel } from "./components/UpdatePanel";
import {
  AppearanceSection,
  CustomCodeSection,
  FontSection,
  GeneralSection,
  LaunchpadSection,
  LoginSection
} from "./components/SettingsSections";
import { usePopupController } from "./hooks/usePopupController";

type PopupPath = "/" | "/appearance" | "/launchpad" | "/font" | "/login" | "/custom-code";
type DetailPopupPath = Exclude<PopupPath, "/">;
type PopupActions = ReturnType<typeof usePopupController>["actions"];
type PopupState = ReturnType<typeof usePopupController>["state"];

const HOME_TITLE_REVEAL_SCROLL = 72;

const pageVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? 48 : -48,
    opacity: 0.72
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? -48 : 48,
    opacity: 0
  })
};

const routeTitles: Record<PopupPath, string> = {
  "/": "飞牛自定义工具",
  "/appearance": "基础外观",
  "/launchpad": "启动台图标",
  "/font": "字体替换",
  "/login": "登录页",
  "/custom-code": "自定义代码"
};

function normalizePopupPath(pathname: string): PopupPath {
  switch (pathname) {
    case "/appearance":
    case "/launchpad":
    case "/font":
    case "/login":
    case "/custom-code":
      return pathname;
    default:
      return "/";
  }
}

interface HomePageProps {
  actions: PopupActions;
  controlsDisabled: boolean;
  disabledNotice: ReactNode;
  navigateTo: (nextPath: DetailPopupPath) => void;
  state: PopupState;
}

function HomePage({ actions, controlsDisabled, disabledNotice, navigateTo, state }: HomePageProps) {
  return (
    <Stack gap="3">
      <PopupHeader
        version={state.manifestVersion}
        originText={state.originText}
        isFnOSWebUi={state.isFnOSWebUi}
      />

      <UpdatePanel
        updateState={state.updateState}
        loading={state.isUpdateChecking}
        onCheck={() => actions.checkForUpdates(true)}
      />

      {disabledNotice}

      <GeneralSection
        disabled={controlsDisabled}
        siteEnabled={state.siteEnabled}
        autoEnableSuspectedFnOS={state.autoEnableSuspectedFnOS}
        onSiteEnabledChange={actions.setSiteEnabled}
        onAutoEnableChange={actions.setAutoEnableSuspectedFnOS}
      />

      <Stack gap="2.5">
        <Text color="fg.muted" textStyle="sm" px="1">
          详细设置
        </Text>

        <SettingsEntryCard
          title="基础外观"
          description="主题色、标题栏、启动台样式和桌面图标布局。"
          icon={<Palette size={18} weight="duotone" />}
          checked={state.basePresetEnabled}
          switchDisabled={controlsDisabled}
          onToggle={actions.setBasePresetEnabled}
          onOpen={() => navigateTo("/appearance")}
        />

        <SettingsEntryCard
          title="启动台图标"
          description="管理完美图标、蒙版和重绘策略。"
          icon={<SquaresFour size={18} weight="duotone" />}
          checked={state.launchpadIconScaleEnabled}
          switchDisabled={controlsDisabled}
          onToggle={actions.setLaunchpadIconScaleEnabled}
          onOpen={() => navigateTo("/launchpad")}
        />

        <SettingsEntryCard
          title="字体替换"
          description="切换 UI 字体、等宽字体和 OpenType 设置。"
          icon={<TextAa size={18} weight="duotone" />}
          checked={state.fontSettings.enabled}
          switchDisabled={controlsDisabled}
          onToggle={(checked) => {
            actions.setFontSettingsDraft({ enabled: checked });
            actions.commitFontSettings();
          }}
          onOpen={() => navigateTo("/font")}
        />

        <SettingsEntryCard
          title="登录页"
          description="管理登录壁纸和默认用户名。"
          icon={<ImageSquare size={18} weight="duotone" />}
          onOpen={() => navigateTo("/login")}
        />

        <SettingsEntryCard
          title="自定义代码"
          description="注入自定义 CSS 和 JavaScript。"
          icon={<BracketsCurly size={18} weight="duotone" />}
          checked={state.customCodeSettings.enabled}
          switchDisabled={controlsDisabled}
          onToggle={(checked) => {
            actions.setCustomCodeSettingsDraft({ enabled: checked });
            actions.commitCustomCodeSettings();
          }}
          onOpen={() => navigateTo("/custom-code")}
        />
      </Stack>

      <Text color="fg.muted" textStyle="xs" px="1">
        如需禁用或修改不生效，请刷新页面后重试。
      </Text>
    </Stack>
  );
}

interface DetailPageProps {
  actions: PopupActions;
  controlsDisabled: boolean;
  disabledNotice: ReactNode;
  state: PopupState;
}

function renderPageContent({
  actions,
  controlsDisabled,
  currentPath,
  disabledNotice,
  navigateTo,
  state
}: DetailPageProps & Pick<HomePageProps, "navigateTo"> & { currentPath: PopupPath }) {
  switch (currentPath) {
    case "/appearance":
      return (
        <Stack gap="3">
          {disabledNotice}
          <AppearanceSection
            disabled={controlsDisabled}
            brandColor={state.brandColor}
            basePresetEnabled={state.basePresetEnabled}
            windowAnimationBlurEnabled={state.windowAnimationBlurEnabled}
            titlebarStyle={state.titlebarStyle}
            launchpadStyle={state.launchpadStyle}
            desktopIconLayoutEnabled={state.desktopIconLayoutEnabled}
            desktopIconLayoutMode={state.desktopIconLayoutMode}
            desktopIconPerColumn={state.desktopIconPerColumn}
            onBasePresetEnabledChange={actions.setBasePresetEnabled}
            onBrandColorPreview={actions.previewBrandColor}
            onBrandColorCommit={actions.commitBrandColor}
            onResetBrandColor={actions.resetBrandColor}
            onWindowAnimationBlurEnabledChange={actions.setWindowAnimationBlurEnabled}
            onTitlebarStyleChange={actions.setTitlebarStyle}
            onLaunchpadStyleChange={actions.setLaunchpadStyle}
            onDesktopIconLayoutEnabledChange={actions.setDesktopIconLayoutEnabled}
            onDesktopIconLayoutModeChange={actions.setDesktopIconLayoutMode}
            onDesktopIconPerColumnChange={actions.setDesktopIconPerColumnDraft}
            onDesktopIconPerColumnCommit={actions.commitDesktopIconPerColumn}
            showMasterSwitch={false}
          />
        </Stack>
      );
    case "/launchpad":
      return (
        <Stack gap="3">
          {disabledNotice}
          <LaunchpadSection
            disabled={controlsDisabled}
            enabled={state.launchpadIconScaleEnabled}
            items={state.launchpadItems}
            status={state.launchpadAppListStatus}
            scaleSelected={state.launchpadIconScaleSelectedKeys}
            maskOnlySelected={state.launchpadIconMaskOnlyKeys}
            redrawSelected={state.launchpadIconRedrawKeys}
            onEnabledChange={actions.setLaunchpadIconScaleEnabled}
            onToggleScale={actions.toggleLaunchpadScale}
            onToggleMaskOnly={actions.toggleLaunchpadMaskOnly}
            onToggleRedraw={actions.toggleLaunchpadRedraw}
            showMasterSwitch={false}
          />
        </Stack>
      );
    case "/font":
      return (
        <Stack gap="3">
          {disabledNotice}
          <FontSection
            disabled={controlsDisabled}
            settings={state.fontSettings}
            onSettingsChange={actions.setFontSettingsDraft}
            onCommit={actions.commitFontSettings}
            showMasterSwitch={false}
          />
        </Stack>
      );
    case "/login":
      return (
        <Stack gap="3">
          {disabledNotice}
          <LoginSection
            disabled={controlsDisabled}
            status={state.loginWallpaperStatus}
            username={state.lockscreenDefaultUsername}
            onWallpaperUpload={actions.uploadLoginWallpaper}
            onWallpaperClear={actions.clearLoginWallpaper}
            onUsernameChange={actions.setLockscreenDefaultUsernameDraft}
            onUsernameCommit={actions.commitLockscreenDefaultUsername}
          />
        </Stack>
      );
    case "/custom-code":
      return (
        <Stack gap="3">
          {disabledNotice}
          <CustomCodeSection
            disabled={controlsDisabled}
            settings={state.customCodeSettings}
            status={state.customCodeStatus}
            onSettingsChange={actions.setCustomCodeSettingsDraft}
            onCommit={actions.commitCustomCodeSettings}
            showMasterSwitch={false}
          />
        </Stack>
      );
    case "/":
    default:
      return (
        <HomePage
          actions={actions}
          controlsDisabled={controlsDisabled}
          disabledNotice={disabledNotice}
          navigateTo={navigateTo}
          state={state}
        />
      );
  }
}

export default function App() {
  const { state, actions } = usePopupController();
  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const currentPath = normalizePopupPath(
    useRouterState({
      select: (routerState) => routerState.location.pathname
    })
  );
  const controlsDisabled = !state.isHttpPage;
  const pendingDirectionRef = useRef(0);
  const pageViewportRef = useRef<HTMLDivElement | null>(null);
  const [showHomeHeaderTitle, setShowHomeHeaderTitle] = useState(false);

  const navigateTo = (nextPath: DetailPopupPath) => {
    if (currentPath === nextPath) return;
    pendingDirectionRef.current = 1;
    startTransition(() => {
      void navigate({ to: nextPath });
    });
  };

  const navigateBack = () => {
    pendingDirectionRef.current = -1;

    if (!canGoBack) {
      if (currentPath === "/") return;
      startTransition(() => {
        void navigate({ to: "/", replace: true });
      });
      return;
    }

    startTransition(() => {
      router.history.back();
    });
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const viewport = pageViewportRef.current;
      if (!viewport) return;
      setShowHomeHeaderTitle(currentPath === "/" && viewport.scrollTop >= HOME_TITLE_REVEAL_SCROLL);
      pendingDirectionRef.current = 0;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [currentPath]);

  const handleViewportScroll = (event: UIEvent<HTMLDivElement>) => {
    if (currentPath !== "/") return;
    const nextVisible = event.currentTarget.scrollTop >= HOME_TITLE_REVEAL_SCROLL;
    setShowHomeHeaderTitle((previous) => (previous === nextVisible ? previous : nextVisible));
  };

  const disabledNotice = !state.isHttpPage ? (
    <Alert.Root status="info" variant="subtle">
      <Alert.Indicator>
        <Info />
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Description>当前页不是 http/https 页面，注入和页面级设置不可用。</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  ) : null;

  const currentPageTitle = routeTitles[currentPath];
  const showBackButton = currentPath !== "/";
  const isHomeRoute = currentPath === "/";
  const showHeaderTitle = !isHomeRoute || showHomeHeaderTitle;
  const viewportPaddingTop = isHomeRoute ? "3" : "16";
  const showHeaderBlur = !isHomeRoute || showHomeHeaderTitle;
  const pageContent = renderPageContent({
    actions,
    controlsDisabled,
    currentPath,
    disabledNotice,
    navigateTo,
    state
  });

  return (
    <Box as="main" h="100%" bg="bg.subtle" overflow="hidden">
      <Box h="100%" overflow="hidden" position="relative">
        <AnimatePresence custom={pendingDirectionRef.current} initial={false} mode="wait">
          <motion.div
            key={currentPath}
            custom={pendingDirectionRef.current}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ height: "100%" }}
            transition={{
              duration: 0.24,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <Box h="100%" overflow="hidden" position="relative">
              <Box className="popup-global-header" position="absolute" top="0" left="0" right="0" zIndex="20">
                <BlurEffect
                  className={`popup-global-header__blur ${showHeaderBlur ? "is-visible" : "is-hidden"}`}
                  intensity={29}
                  position="top"
                />
                <Box className={`popup-global-header__surface ${isHomeRoute ? "is-home" : ""}`}>
                  {showBackButton ? (
                    <button
                      type="button"
                      className="popup-global-header__back"
                      onClick={navigateBack}
                      aria-label="返回"
                    >
                      <CaretLeftIcon size={20} weight="bold" />
                    </button>
                  ) : null}
                  <Text
                    className={`popup-global-header__title ${isHomeRoute ? "is-home" : ""} ${showHeaderTitle ? "is-visible" : ""}`}
                    as="h1"
                  >
                    {currentPageTitle}
                  </Text>
                </Box>
              </Box>

              <Box
                ref={pageViewportRef}
                data-scroll-restoration-id="popup-viewport"
                h="100%"
                overflowY="auto"
                overflowX="hidden"
                px="3"
                pt={viewportPaddingTop}
                pb="3"
                onScroll={handleViewportScroll}
              >
                {pageContent}
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
