import cookie from "cookie";
import jwtDecode from "jwt-decode";

import { mainAPI } from "@/plugins/axios";
import dayjs from "@/plugins/dayjs";

const withAuthServerSideProps = (serverSidePropsFunc) => {
  return async (ctx) => {
    const cookies = cookie.parse(ctx.req.headers.cookie || "");
    if (cookies.fo_sas_tk) {
      mainAPI.defaults.headers.common.Authorization = `Bearer ${cookies.fo_sas_tk}`;
      try {
        let user;
        const { data } = await mainAPI.get("/users/me");
        user = data;
        if (
          (!user.firstName || !user.lastName) &&
          !ctx.req.url.includes("details")
        ) {
          ctx.res.writeHead(302, { Location: "/signup/details" });
          ctx.res.end();
          return { props: {} };
        } else if (
          user.firstName &&
          user.lastName &&
          dayjs().diff(dayjs(user.createdAt), "day") > 14 &&
          (!user.subscription || user.subscription.status !== "active") &&
          !ctx.req.url.includes("expired=true")
        ) {
          ctx.res.writeHead(302, { Location: "/app?expired=true" });
          ctx.res.end();
          return { props: {} };
        }
        if (serverSidePropsFunc) {
          const otherProps = await serverSidePropsFunc(ctx, user);
          return {
            props: {
              ...(user && { me: user }),
              ...otherProps,
            },
          };
        }
        return {
          props: {
            ...(user && { me: user }),
          },
        };
      } catch (err) {
        console.log(err);
        ctx.res.writeHead(302, {
          Location: process.env.NEXT_PUBLIC_STATIC_PAGE,
        });
        ctx.res.end();
        return { props: {} };
      }
    } else if (
      !ctx.req.url.includes("login") &&
      !ctx.req.url.includes("signup")
    ) {
      ctx.res.writeHead(302, { Location: process.env.NEXT_PUBLIC_STATIC_PAGE });
      ctx.res.end();
      return { props: {} };
    } else {
      return { props: {} };
    }
  };
};

export default withAuthServerSideProps;
