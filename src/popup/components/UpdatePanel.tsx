import { Badge, Button, Card, HStack, Link, Stack, Text } from "@chakra-ui/react";
import { ArrowSquareOut, ArrowsClockwise, WarningCircle } from "@phosphor-icons/react";
import { formatCommitDate, getUpdateStatusText, shortSha, truncateText } from "../lib/utils";
import type { UpdateState } from "../types";

interface UpdatePanelProps {
  updateState: UpdateState;
  loading: boolean;
  onCheck: () => void;
}

export function UpdatePanel({ updateState, loading, onCheck }: UpdatePanelProps) {
  const sha = shortSha(updateState.latestSha);
  const dateText = formatCommitDate(updateState.latestDate);
  const commitLabel = sha
    ? `最新提交：${sha}${dateText ? ` · ${dateText}` : ""}`
    : "最新提交：读取中...";

  return (
    <Card.Root borderColor={updateState.hasUpdate ? "var(--accent-border-strong)" : undefined}>
      <Card.Body gap="2.5">
        <HStack align="start" justify="space-between" gap="3">
          <HStack align="start" gap="3">
            {updateState.hasUpdate ? (
              <HStack color="var(--brand)">
                <WarningCircle size={18} weight="duotone" />
              </HStack>
            ) : (
              <ArrowsClockwise size={18} weight="duotone" />
            )}
            <Stack gap="1">
              <HStack gap="2" wrap="wrap">
                <Text fontWeight="semibold">更新检查</Text>
                {updateState.hasUpdate ? (
                  <Badge
                    bg="var(--accent-soft)"
                    color="var(--brand)"
                    borderWidth="1px"
                    borderColor="var(--accent-border-strong)"
                  >
                    有新版本
                  </Badge>
                ) : null}
              </HStack>
              <Text color="fg.muted" textStyle="sm">
                {getUpdateStatusText(updateState)}
              </Text>
            </Stack>
          </HStack>

          <Button size="sm" variant="outline" loading={loading} onClick={onCheck}>
            检查
          </Button>
        </HStack>

        <Link
          href={updateState.latestUrl}
          target="_blank"
          rel="noreferrer"
          display="inline-flex"
          alignItems="center"
          gap="2"
          color={updateState.hasUpdate ? "var(--brand)" : "fg.muted"}
          textStyle="sm"
        >
          <ArrowSquareOut size={14} />
          <Text as="span">
            {commitLabel}
            {updateState.latestMessage ? ` · ${truncateText(updateState.latestMessage, 48)}` : ""}
          </Text>
        </Link>
      </Card.Body>
    </Card.Root>
  );
}
