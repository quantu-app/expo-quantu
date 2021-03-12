import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import { middleware } from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

polka()
  .use(compression({ threshold: 0 }), sirv("static", { dev }), middleware())
  .listen(PORT, (err: Error) => {
    if (err) {
      console.log("error", err);
    }
  });
