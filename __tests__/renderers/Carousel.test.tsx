import React = require("react");
import { render, fireEvent } from "react-testing-library";
import "../../src/themes/default";
import { render as amisRender } from "../../src/index";
import { makeEnv } from "../helper";

test("Renderer:carousel", async () => {
  const { container } = render(
    amisRender(
      {
        type: "carousel",
        controlsTheme: "light",
        width: "500",
        height: "300",
        options: [
          {
            image:
              "https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png",
            title: "标题",
            titleClassName: "block",
            description: "描述",
            descriptionClassName: "block"
          },
          {
            html:
              '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
          },
          {
            image:
              "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
          }
        ],
        className: "show"
      },
      {},
      makeEnv({})
    )
  );

  const image = document.querySelector("div.a-Carousel-item");
  fireEvent.mouseEnter(image as HTMLDivElement);
  const leftArrow = document.querySelector("div.a-Carousel-leftArrow");
  fireEvent.click(leftArrow as HTMLDivElement);
  const rightArrow = document.querySelector("div.a-Carousel-rightArrow");
  fireEvent.click(rightArrow as HTMLDivElement);

  expect(container).toMatchSnapshot();
});
