import { Box, Button, Card, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { CaretRight } from "@phosphor-icons/react";
import { type ReactNode } from "react";
import { PopupSwitch } from "./PopupSwitch";

interface SettingsEntryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  checked?: boolean;
  switchDisabled?: boolean;
  onToggle?: (checked: boolean) => void;
  onOpen: () => void;
}

export function SettingsEntryCard({
  title,
  description,
  icon,
  checked,
  switchDisabled,
  onToggle,
  onOpen
}: SettingsEntryCardProps) {
  return (
    <Card.Root>
      <Card.Body gap="2.5">
        <HStack align="start" justify="space-between" gap="3">
          <HStack align="start" gap="3" flex="1">
            <HStack color="fg.muted">{icon}</HStack>
            <Stack gap="1" flex="1">
              <Heading size="sm">{title}</Heading>
              <Text color="fg.muted" textStyle="sm">
                {description}
              </Text>
            </Stack>
          </HStack>

          <HStack align="center" gap="2" flexShrink={0}>
            {typeof checked === "boolean" && onToggle ? (
              <PopupSwitch checked={checked} disabled={switchDisabled} onChange={onToggle} />
            ) : null}
            <Box h="8" borderLeftWidth="1px" borderColor="border.muted" />
            <Button
              size="sm"
              variant="ghost"
              px="2"
              minW="10"
              aria-label={`${title}详情`}
              onClick={onOpen}
            >
              <CaretRight size={18} />
            </Button>
          </HStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
