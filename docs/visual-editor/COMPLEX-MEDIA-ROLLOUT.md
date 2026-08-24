# Phase 8 — Complex, Optional, and Media Rollout

> Scope: final review of complex production representations. No interaction is enabled unless draft data already reaches the production node through a resolver/model boundary.

## Media Contract

`EditableMediaContract` records semantic (`image`, `background-image`, or `video`), ownership, replace capability, optionality, and a blocker. It contains no URL field, media identifier UI, picker layout, or section component. `EditableActionContract` applies the same rule to CTA/link ownership. `EditableFieldContract.optional` distinguishes a supported absent field from a field that does not belong to the component.

All reviewed complex media contracts are currently `blocked`. This is intentional: the production renderers still consume fixtures/hardcoded URLs while PageBuilder stores media IDs. Invoking the existing DOM-patching picker would change pixels without proving resolver authority.

## Image Replacement

No complex image currently satisfies the required path:

```text
media ID → shared media resolver → production model → existing production JSX
```

Therefore Phase 8 does not expose `Thay ảnh`, raw IDs, or URL inputs. Award images additionally lack stable persisted item identity. Partner/project entity images remain entity-owned and are not Media targets on landing pages.

## Video Behavior

Home Intro and About Overview production video URLs are hardcoded and do not resolve from PageBuilder config. Their video replacement remains BLOCKED. The existing Edit canvas globally suppresses animation and pauses video; Home Hero autoplay is already disabled through `editMode`. No raw YouTube/Vimeo URL control is attached to production video regions.

## CTA Contract

- Hero CTA IDs and About contact CTA IDs are reference-owned but not resolved into the production buttons.
- Home Contact CTA copy/form config is not yet a production model.
- Visitor form input values remain interaction-only and are never CMS editing targets.

CTA navigation remains production behavior in Preview/Public. No landing-page child label/href editing is enabled while ownership is unresolved.

## Optional Slot Contract

The contract can mark media, actions, and fields optional, but no optional placeholder is rendered. Optional Hero mobile media, secondary CTA, Intro media/video/CTA/download, and Overview video lack approved resolver/default/remove contracts. A `+` would currently create editor-only layout, so all remain BLOCKED.

## Hero

`home.hero` stays the existing production carousel. Edit Mode already stops autoplay and selects a deterministic slide through `previewSlideIndex`. Title editing is BLOCKED because production uses intentional HTML while CMS stores plain text. Background/mobile images, subtitle, CTA IDs, badge, and ticker remain blocked until one complete Hero production model can replace the parallel fixture source. Pagination/gradients/pulse layers are derived or decorative.

## Intro

`home.intro` remains production JSX. Its highlighted heading, paragraphs, CTA, profile link, image/video configuration, thumbnail, and play state are not driven by a shared production model. Video playback is stable in Edit Mode, but authoring is blocked rather than exposed through URL inputs.

## About Hero

Title representation, background image, subtitle, and background-video expectations do not share a reviewed production model. Gradients remain decorative. Media replacement and text editing are blocked.

## Contact CTA

Home/About CTA sections remain production representations. CTA entities, form references, page-owned copy, phone/email, and submit label are not yet resolved into those renderers. Visitor inputs, tabs, submit state, and success state are never content targets.

## Forms

Contact form fields and visitor-entered values are interaction state, not PageBuilder content. Form entity replacement is blocked until a production form resolver exists. Page-owned title/submit/success copy may be onboarded later only after explicit production wiring.

## Organization

The organization chart is an inline SVG/code-owned topology without node data models or stable IDs. No SVG descendant scanning or generic SVG editor is introduced.

## Legal Rich Text

CMS Legal content renders draft HTML, but the direct text runtime is not a safe arbitrary-rich-HTML authoring surface. `legal.content.richTextHtml` is explicitly BLOCKED pending a reviewed sanitizer, selection model, and whole-block rich-text interaction. No `dangerouslySetInnerHTML` DOM mutation is used as authoring state.

## Blocked Complex Content

| Area | Reason | Required decision |
| --- | --- | --- |
| Hero | parallel fixture/CMS sources; rich-title mismatch | complete Hero production model and structured title contract |
| Intro/Overview | hardcoded rich copy and video | production model plus video-source contract |
| Awards | Media resolver and stable item identity absent | media boundary and identity migration |
| CTA/Form | entity/page ownership not resolved | CTA/Form resolver and destination interaction |
| Optional slots | defaults/removal/layout unknown | explicit slot creation/removal contract |
| Organization | SVG topology has no content model | node schema and stable IDs |
| Legal rich text | arbitrary HTML safety unknown | sanitizer and rich-text session contract |

## Legacy Chrome Cleanup

Every reviewed section now carries an editable contract, including blocked-only contracts. A blocked contract is documentation/capability metadata only: it does not opt the section into the direct-edit runtime. The canvas bypasses the existing editor only for sections with a working mutation adapter or reference interaction. This preserves previously available editing on blocked Phase 8 sections until their replacement runtime is genuinely complete.

## Verdict

```text
PASS WITH DOCUMENTED BLOCKERS
```

The complex sections preserve production representation and stable Edit Mode. No media/CTA/optional authoring is falsely reported as complete.
