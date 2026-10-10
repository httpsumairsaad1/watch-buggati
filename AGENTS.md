<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep the watch experience on the index route with focused sequence, movement explorer, and viewing form modules so animation updates stay isolated from page rendering.
- Store user-provided watch frames as Lovable Assets pointers, and preload the optimized sequence before starting GSAP scroll interpolation to avoid network work during animation.
- Derive sequence bounds from the asset count and scroll duration from actual sticky travel with stable viewport units, so frame expansion and mobile browser resizing preserve the animation.
- Render the decorative React Three Fiber lighting behind a lazy ClientOnly boundary so browser graphics never run during server rendering.
- Render the movement explorer as photographic depth layers in a separate lazy ClientOnly R3F scene with shared tab/hotspot selection, preserving the actual product rather than approximating its mechanics with primitive models.
- Collect viewing requests through the generated browser Cloud client with insert-only visitor access and no public reads to protect personal details.
