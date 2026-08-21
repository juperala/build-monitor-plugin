import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { withWordBreaks } from "./word-break.tsx";

function renderName(name: string) {
  const { container } = render(<span>{withWordBreaks(name)}</span>);
  return container.firstElementChild as HTMLElement;
}

describe("withWordBreaks", () => {
  it("offers a break opportunity after dots", () => {
    expect(renderName("MyOrganization.MyTeam.MyApplication").innerHTML).toBe(
      "MyOrganization.<wbr>MyTeam.<wbr>MyApplication",
    );
  });

  it("offers a break opportunity after underscores", () => {
    expect(renderName("MyOrganization_MyTeam_MyApplication").innerHTML).toBe(
      "MyOrganization_<wbr>MyTeam_<wbr>MyApplication",
    );
  });

  it("offers a break opportunity after any run of separators", () => {
    expect(renderName("MyOrganization.MyTeam-MyApp::v2").innerHTML).toBe(
      "MyOrganization.<wbr>MyTeam-<wbr>MyApp::<wbr>v2",
    );
  });

  it("leaves names the browser can already wrap alone", () => {
    expect(renderName("My Organization My Team").innerHTML).toBe(
      "My Organization My Team",
    );
  });

  it("leaves names without separators alone, to be broken by CSS", () => {
    expect(renderName("MyOrganizationMyTeamMyApplication").innerHTML).toBe(
      "MyOrganizationMyTeamMyApplication",
    );
  });

  it("keeps the name matchable, copyable and searchable as one string", () => {
    const name = "MyOrganization.MyTeam.MyApplication.MyJob-with-slash";
    expect(renderName(name).textContent).toBe(name);
  });

  it("does not offer to break a word at an accent", () => {
    // "Zurich" as "u" plus a combining diaeresis, which could wrap as "Zu"/"rich"
    const decomposed = "Zu\u0308rich";

    expect(renderName(decomposed).innerHTML).toBe(decomposed);
  });

  it("keeps a multi-codepoint emoji in one piece", () => {
    expect(renderName("\u{1F468}\u200D\u{1F4BB}dev").innerHTML).toBe(
      "\u{1F468}\u200D\u{1F4BB}<wbr>dev",
    );
  });
});
