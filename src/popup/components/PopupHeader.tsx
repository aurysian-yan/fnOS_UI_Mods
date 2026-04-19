import { Badge, Button, Card, Code, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { GithubLogo, GlobeHemisphereWest, RocketLaunch } from "@phosphor-icons/react";
import { GITHUB_REPO_URL } from "../lib/constants";
import React from "react";

interface PopupHeaderProps {
  version: string;
  originText: string;
  isFnOSWebUi: boolean;
}

export function PopupHeader({ version, originText, isFnOSWebUi }: PopupHeaderProps) {
  return (
    <Card.Root>
      <Card.Body gap="3">
        <HStack align="start" justify="space-between" gap="3">
          <HStack align="start" gap="3">
            <HStack color="var(--brand)">
              <RocketLaunch size={20} weight="duotone" />
            </HStack>
            <Stack gap="1">
              <Text color="fg.muted" fontSize="xs" textTransform="uppercase" letterSpacing="wide">
                FnOS UI Mods
              </Text>
              <Heading size="md">飞牛自定义工具</Heading>
            </Stack>
          </HStack>
          <Button
            as="a"
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            size="sm"
            variant="outline"
          >
            <GithubLogo size={16} />
            GitHub
          </Button>
        </HStack>

        <HStack gap="2" wrap="wrap">
          <Badge bg="bg.muted" color="fg" borderWidth="1px" borderColor="border">
            版本 {version || "读取中"}
          </Badge>
          <Badge
            bg={isFnOSWebUi ? "var(--accent-soft)" : "bg.muted"}
            color={isFnOSWebUi ? "var(--brand)" : "fg.muted"}
            borderWidth="1px"
            borderColor={isFnOSWebUi ? "var(--accent-border-strong)" : "border"}
          >
            {isFnOSWebUi ? "已识别为 fnOS WebUI" : "未识别为 fnOS WebUI"}
          </Badge>
        </HStack>

        <Stack gap="1.5">
          <HStack color="fg.muted" gap="2">
            <GlobeHemisphereWest size={16} />
            <Text textStyle="sm">当前站点</Text>
          </HStack>
          <Code whiteSpace="pre-wrap" wordBreak="break-all" px="3" py="2">
            {originText}
          </Code>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
