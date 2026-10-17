
/* TWOTERM BUTTON CONTROLLER
   Uses existing Supabase tables.
*/
(() => {
  const db = () =>
    window.supabaseClient ||
    window.twotermSupabase ||
    window.owinoSupabase;

  async function getUser() {
    const client = db();
    if (!client) throw new Error("Supabase client is not connected.");

    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    if (!data.user) throw new Error("Please log in first.");

    return data.user;
  }

  async function countRows(table, column, value) {
    const { count, error } = await db()
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq(column, value);

    if (error) throw error;
    return count || 0;
  }

  async function toggleLike(button) {
    const client = db();
    const user = await getUser();
    const postId = button.dataset.postId;
    if (!postId) throw new Error("This video has no post ID.");

    const { data: existing, error: findError } = await client
      .from("app_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (findError) throw findError;

    if (existing) {
      const { error } = await client
        .from("app_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) throw error;
      button.dataset.liked = "false";
    } else {
      const { error } = await client
        .from("app_likes")
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;
      button.dataset.liked = "true";
    }

    const count = await countRows("app_likes", "post_id", postId);
    button.querySelector("[data-count]")?.replaceChildren(
      document.createTextNode(String(count))
    );
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.liked === "true")
    );
  }

  async function toggleFollow(button) {
    const client = db();
    const user = await getUser();
    const creatorId = button.dataset.userId;

    if (!creatorId) throw new Error("Creator ID is missing.");
    if (creatorId === user.id) {
      throw new Error("You cannot follow your own account.");
    }

    const { data: existing, error: findError } = await client
      .from("app_follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", creatorId)
      .maybeSingle();

    if (findError) throw findError;

    if (existing) {
      const { error } = await client
        .from("app_follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", creatorId);

      if (error) throw error;
      button.dataset.following = "false";
      button.textContent = "Follow";
    } else {
      const { error } = await client
        .from("app_follows")
        .insert({
          follower_id: user.id,
          following_id: creatorId
        });

      if (error) throw error;
      button.dataset.following = "true";
      button.textContent = "Following";
    }

    const count = await countRows(
      "app_follows",
      "following_id",
      creatorId
    );

    document
      .querySelectorAll(`[data-followers-for="${creatorId}"]`)
      .forEach(el => el.textContent = String(count));
  }

  async function openProfile(userId) {
    const client = db();

    const { data: profile, error } = await client
      .from("app_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    if (!profile) throw new Error("This creator profile was not found.");

    const { data: posts, error: postsError } = await client
      .from("app_posts")
      .select("*")
      .eq("user_id", userId)
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    if (postsError) throw postsError;

    // Reuse a profile area if your homepage already has one.
    let view = document.getElementById("profileView");

    if (!view) {
      view = document.createElement("section");
      view.id = "profileView";
      view.style.cssText =
        "padding:20px;max-width:800px;margin:auto;color:inherit";
      document.querySelector("main")?.prepend(view);
      if (!view.isConnected) document.body.prepend(view);
    }

    const safe = value => {
      const el = document.createElement("span");
      el.textContent = value || "";
      return el.innerHTML;
    };

    view.innerHTML = `
      <button type="button" data-action="close-profile">← Back</button>
      <div style="padding:20px 0">
        ${profile.avatar_url
          ? `<img src="${safe(profile.avatar_url)}"
              alt="" style="width:80px;height:80px;border-radius:50%;
              object-fit:cover">`
          : ""}
        <h2>${safe(profile.display_name || profile.username || "Creator")}</h2>
        <p>@${safe(profile.username || "user")}</p>
        <p>${safe(profile.bio)}</p>
        <p>
          <span data-followers-for="${profile.id}">…</span> followers
          · ${posts.length} public posts
        </p>
        <button type="button" data-action="follow"
          data-user-id="${profile.id}">Follow</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
        ${posts.map(post => {
          const media = post.video_url || post.media_url;
          if (!media) return "";
          return `
            <article style="min-width:0">
              <video controls playsinline preload="metadata"
                style="width:100%;max-height:320px;background:#111">
                <source src="${safe(media)}">
              </video>
              <p>${safe(post.caption)}</p>
              <p>♥ ${Number(post.likes_count || 0)}
                 · Views ${Number(post.views_count || 0)}</p>
            </article>`;
        }).join("")}
      </div>
    `;

    const followers = await countRows(
      "app_follows", "following_id", profile.id
    );
    view.querySelectorAll(`[data-followers-for="${profile.id}"]`)
      .forEach(el => el.textContent = String(followers));

    view.scrollIntoView({ behavior: "smooth" });
  }

  document.addEventListener("click", async event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;

    try {
      if (["like", "follow"].includes(action)) {
        button.disabled = true;
        if (action === "like") await toggleLike(button);
        if (action === "follow") await toggleFollow(button);
      } else if (action === "open-profile") {
        await openProfile(button.dataset.userId);
      } else if (action === "close-profile") {
        document.getElementById("profileView")?.remove();
      }
    } catch (error) {
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      button.disabled = false;
    }
  });

  console.log("TWOTERM button controller loaded.");
})();
                            
