import { Card, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { type ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function SectionCard({ title, description, icon, children }: SectionCardProps) {
  return (
    <Card.Root>
      <Card.Header pb="2">
        <HStack align="start" gap="3">
          {icon ? <HStack color="fg.muted">{icon}</HStack> : null}
          <Stack gap="1" flex="1">
            <Heading size="sm">{title}</Heading>
            {description ? (
              <Text color="fg.muted" textStyle="sm">
                {description}
              </Text>
            ) : null}
          </Stack>
        </HStack>
      </Card.Header>
      <Card.Body pt="0">
        <Stack gap="3">{children}</Stack>
      </Card.Body>
    </Card.Root>
  );
}
