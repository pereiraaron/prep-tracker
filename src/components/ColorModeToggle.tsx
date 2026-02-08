import { IconButton } from "@chakra-ui/react";
import { LuSun, LuMoon } from "react-icons/lu";
import { useColorMode } from "@hooks/useColorMode";

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle color mode"
      variant="outline"
      size="lg"
      rounded="full"
      position="fixed"
      bottom={6}
      left={6}
      zIndex={10}
      onClick={toggleColorMode}
    >
      {colorMode === "light" ? <LuMoon /> : <LuSun />}
    </IconButton>
  );
};

export default ColorModeToggle;
