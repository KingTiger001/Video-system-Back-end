// Texts
import TextPreset1 from "./TextPresets/preset1";
import TextPreset2 from "./TextPresets/preset2";
import TextPreset3 from "./TextPresets/preset3";
import TextPreset4 from "./TextPresets/preset4";

// Links
import LinkPreset1 from "./LinkPresets/preset1";
import LinkPreset2 from "./LinkPresets/preset2";
import LinkPreset3 from "./LinkPresets/preset3";
import LinkPreset4 from "./LinkPresets/preset4";

export const textPresets = [0, 1, 2, 3, 4];
export const linkPresets = [0, 1, 2, 3, 4];

export const renderPresetElement = (elem, type) => {
  if (type === "text") {
    switch (elem.preset) {
      case 1:
        return (
          <TextPreset1
            value={elem.value}
            color={elem.color}
            fontSize={elem.fontSize}
          />
        );
      case 2:
        return (
          <TextPreset2
            value={elem.value}
            color={elem.color}
            fontSize={elem.fontSize}
          />
        );
      case 3:
        return (
          <TextPreset3
            value={elem.value}
            color={elem.color}
            fontSize={elem.fontSize}
          />
        );
      case 4:
        return (
          <TextPreset4
            value={elem.value}
            color={elem.color}
            fontSize={elem.fontSize}
          />
        );
      default:
        return (
          <p style={{ fontSize: `${elem.fontSize}rem`, color: elem.color }}>
            {elem.value}
          </p>
        );
    }
  } else if (type === "link") {
    switch (elem.preset) {
      case 1:
        return (
          <LinkPreset1
            color={elem.color}
            fontSize={elem.fontSize}
            value={elem.value}
          />
        );
      case 2:
        return (
          <LinkPreset2
            color={elem.color}
            fontSize={elem.fontSize}
            value={elem.value}
          />
        );
      case 3:
        return (
          <LinkPreset3
            color={elem.color}
            fontSize={elem.fontSize}
            value={elem.value}
          />
        );
      case 4:
        return (
          <LinkPreset4
            color={elem.color}
            fontSize={elem.fontSize}
            value={elem.value}
          />
        );
      default:
        return (
          <p style={{ fontSize: `${elem.fontSize}rem`, color: elem.color }}>
            {elem.value}
          </p>
        );
    }
  }
};