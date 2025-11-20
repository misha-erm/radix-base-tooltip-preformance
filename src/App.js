import "./styles.css";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
// import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { useState } from "react";
import afterFrame from "afterframe";
import { Tooltip as BaseTooltip } from "@base-ui-components/react";

function measureInteraction() {
  const startTimestamp = performance.now();

  return {
    end() {
      const endTimestamp = performance.now();
      const duration = endTimestamp - startTimestamp;
      console.log("The interaction took", duration, "ms");
      return duration;
    },
  };
}

const Item = ({ idx }) => <span>{`Item ${idx} - ${Math.random()}`}</span>;

const ItemWithTooltip = ({ idx }) => {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        <button>
          <Item idx={idx} />
        </button>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content className="TooltipContent">
          This is title
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};
// const ItemWithContextMenu = ({ idx }) => {
//   return (
//     <ContextMenuPrimitive.Root>
//       <ContextMenuPrimitive.Trigger asChild>
//         <span>
//           <Item idx={idx} />
//         </span>
//       </ContextMenuPrimitive.Trigger>
//       <ContextMenuPrimitive.Portal>
//         <ContextMenuPrimitive.Content className="TooltipContent">
//           <ContextMenuPrimitive.Item>Back</ContextMenuPrimitive.Item>
//           <ContextMenuPrimitive.Item>Foward</ContextMenuPrimitive.Item>
//           <ContextMenuPrimitive.Item>Reload</ContextMenuPrimitive.Item>
//         </ContextMenuPrimitive.Content>
//       </ContextMenuPrimitive.Portal>
//     </ContextMenuPrimitive.Root>
//   );
// };

const SlowList = () => {
  return (
    <TooltipPrimitive.Provider>
      <div className="slow-list">
        {Array.from({ length: 2000 }).map((_, idx) => (
          <ItemWithTooltip key={idx} idx={idx} />
        ))}
      </div>
    </TooltipPrimitive.Provider>
  );
};

const BaseItemWithTooltip = ({ idx }) => {
  return (
    <BaseTooltip.Root title={"This is title"}>
      <BaseTooltip.Trigger render={<button />}>
        <Item idx={idx} />
      </BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner>
          <BaseTooltip.Popup className="TooltipContent">
            This is title
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
};

const LazyBaseItemWithTooltip = ({ idx }) => {
  const [handle] = useState(() => BaseTooltip.createHandle());
  const [activated, setActivated] = useState(false);

  return (
    <>
      <BaseTooltip.Trigger
        handle={handle}
        render={<button onMouseEnter={() => setActivated(true)} />}
      >
        <Item idx={idx} />
      </BaseTooltip.Trigger>

      {activated ? (
        <BaseTooltip.Root title={"This is title"}>
          <BaseTooltip.Trigger>
            <Item idx={idx} />
          </BaseTooltip.Trigger>
          <BaseTooltip.Portal>
            <BaseTooltip.Positioner>
              <BaseTooltip.Popup className="TooltipContent">
                This is title
              </BaseTooltip.Popup>
            </BaseTooltip.Positioner>
          </BaseTooltip.Portal>
        </BaseTooltip.Root>
      ) : (
        false
      )}
    </>
  );
};

const BaseSlowList = () => {
  return (
    <BaseTooltip.Provider>
      <div className="slow-list">
        {Array.from({ length: 2000 }).map((_, idx) => (
          <LazyBaseItemWithTooltip key={idx} idx={idx} />
        ))}
      </div>
    </BaseTooltip.Provider>
  );
};

const BaseLazyList = () => {
  return (
    <BaseTooltip.Provider>
      <div className="slow-list">
        {Array.from({ length: 2000 }).map((_, idx) => (
          <BaseItemWithTooltip key={idx} idx={idx} />
        ))}
      </div>
    </BaseTooltip.Provider>
  );
};

const RenderMeasure = ({ rerender }) => {
  const [lastInteraction, setLastInteraction] = useState(0);

  const handleClick = () => {
    const interaction = measureInteraction();

    // The afterFrame library calls the function
    // when the next frame starts
    afterFrame(() => {
      setLastInteraction(interaction.end());
    });

    rerender();
  };

  return (
    <>
      {lastInteraction ? (
        <div>Last interaction took: ~{Math.round(lastInteraction)}ms</div>
      ) : null}

      <button onClick={handleClick}>Re-render</button>
    </>
  );
};

export default function App() {
  const [, setCounter] = useState(0);

  const [mode, setMode] = useState("radix");

  return (
    <div className="App">
      <h1>Tooltip performance demo</h1>
      <p>Please open console, click "Re-render" and check the ouput </p>
      <p>
        To test the preformance without Tooltip - replace `ItemWithTooltip` with
        `Item` in App.js
      </p>
      <p>
        On my MacBook Pro M2 Max the render takes around 50-60ms without Tooltip
        and ~320ms with Tooltip. (on Macbook Pro 2018 it was around ~500ms)
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="radix">Radix</option>
          <option value="base">Base UI</option>
          <option value="base-lazy">Base UI - lazy activation</option>
        </select>
      </div>

      <RenderMeasure
        key={mode}
        rerender={() => setCounter((prev) => prev + 1)}
      />

      {mode === "radix" ? (
        <SlowList />
      ) : mode === "base" ? (
        <BaseSlowList />
      ) : (
        <BaseLazyList />
      )}
    </div>
  );
}
