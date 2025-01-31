// ServerActionTestPage component
import { addPost, deletePost } from "@/lib/action";

const ServerActionTestPage = () => {
  return (
    <div>
      <form method="POST" action={addPost}>
        <input type="text" placeholder="title" name="title" />
        <input type="text" placeholder="desc" name="desc" />
        <input type="text" placeholder="slug" name="slug" />
        <input type="text" placeholder="userId" name="userId" />
        <button type="submit">Create</button>
      </form>

      <form method="POST" action={deletePost}>
        <input type="text" placeholder="postId" name="id" />
        <button type="submit">Delete</button>
      </form>
    </div>
  );
};

export default ServerActionTestPage;
