import { addPost, deletePost } from "@/lib/action";

const ServerActionTestPage = () => {
  return (
    <div>
      <form action={addPost} method="post">
        <input type="text" name="title" placeholder="Title" required />
        <input type="text" name="desc" placeholder="Description" required />
        <input type="text" name="slug" placeholder="Slug" required />
        <input type="text" name="userId" placeholder="User ID" required />
        <button type="submit">Create</button>
      </form>

      <form action={deletePost}>
        <input type="text" placeholder="postId" name="id" required />
        <button type="submit">Delete</button>
      </form>
    </div>
  );
};

export default ServerActionTestPage;
