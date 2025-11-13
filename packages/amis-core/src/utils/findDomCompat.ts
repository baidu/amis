import React from 'react';
import ReactDom from 'react-dom';

type ReactInstance = React.Component | HTMLElement | Text;
type Fiber = any;

// React Fiber tag types - only the ones we use
const HostRoot = 3;
const HostComponent = 5;
const HostText = 6;
const HostHoistable = 26;
const HostSingleton = 27;

// React Fiber flag types - only the ones we use
const NoFlags = /*                      */ 0b0000000000000000000000000000000;
const Placement = /*                    */ 0b0000000000000000000000000000010;
const Hydrating = /*                    */ 0b0000000000000000001000000000000;

/**
 * 从 React 组件实例获取关联的 DOM 节点
 * 基于 React 内部 Fiber 结构实现
 *
 * 原理：
 * - React 组件实例上存储了一个隐藏的 Fiber 引用
 * - Fiber 树包含了组件与 DOM 的映射关系
 * - 通过遍历 Fiber 树可以找到关联的 DOM 节点
 */
function getDOMNode(
  instance: ReactInstance | null | undefined
): HTMLElement | null {
  if (!instance) {
    return null;
  }

  if (instance instanceof HTMLElement) {
    return instance;
  }

  if (instance instanceof Text) {
    return null;
  }

  // 尝试从组件实例获取 Fiber 引用
  // React 在不同版本中存储 Fiber 的属性名不同：
  // - React 18+: instance._reactInternals (React Element 实例上的 Fiber)
  // - React 16-17: instance._reactInternalFiber (旧版本的 Fiber 属性)
  let fiber =
    (instance as any)._reactInternals || (instance as any)._reactInternalFiber;

  if (!fiber) {
    if (ReactDom.findDOMNode) {
      return ReactDom.findDOMNode(instance) as HTMLElement;
    }
    throw new Error(
      'Cannot support the current React version. Please report an issue.'
    );
  }

  const hostFiber = findCurrentHostFiber(fiber);
  if (hostFiber === null) {
    return null;
  }
  return hostFiber.stateNode as HTMLElement;
}

export const findDomCompat = getDOMNode;

// -----------------------------
// 以下代码来自 react-reconciler 库的实现
export function findCurrentHostFiber(parent: Fiber): Fiber | null {
  const currentParent = findCurrentFiberUsingSlowPath(parent);
  return currentParent !== null
    ? findCurrentHostFiberImpl(currentParent)
    : null;
}

function findCurrentFiberUsingSlowPath(fiber: Fiber): Fiber | null {
  const alternate = fiber.alternate;
  if (!alternate) {
    // If there is no alternate, then we only need to check if it is mounted.
    const nearestMounted = getNearestMountedFiber(fiber);

    if (nearestMounted === null) {
      throw new Error('Unable to find node on an unmounted component.');
    }

    if (nearestMounted !== fiber) {
      return null;
    }
    return fiber;
  }
  // If we have two possible branches, we'll walk backwards up to the root
  // to see what path the root points to. On the way we may hit one of the
  // special cases and we'll deal with them.
  let a: Fiber = fiber;
  let b: Fiber = alternate;
  while (true) {
    const parentA = a.return;
    if (parentA === null) {
      // We're at the root.
      break;
    }
    const parentB = parentA.alternate;
    if (parentB === null) {
      // There is no alternate. This is an unusual case. Currently, it only
      // happens when a Suspense component is hidden. An extra fragment fiber
      // is inserted in between the Suspense fiber and its children. Skip
      // over this extra fragment fiber and proceed to the next parent.
      const nextParent = parentA.return;
      if (nextParent !== null) {
        a = b = nextParent;
        continue;
      }
      // If there's no parent, we're at the root.
      break;
    }

    // If both copies of the parent fiber point to the same child, we can
    // assume that the child is current. This happens when we bailout on low
    // priority: the bailed out fiber's child reuses the current child.
    if (parentA.child === parentB.child) {
      let child = parentA.child;
      while (child) {
        if (child === a) {
          // We've determined that A is the current branch.
          assertIsMounted(parentA);
          return fiber;
        }
        if (child === b) {
          // We've determined that B is the current branch.
          assertIsMounted(parentA);
          return alternate;
        }
        child = child.sibling;
      }

      // We should never have an alternate for any mounting node. So the only
      // way this could possibly happen is if this was unmounted, if at all.
      throw new Error('Unable to find node on an unmounted component.');
    }

    if (a.return !== b.return) {
      // The return pointer of A and the return pointer of B point to different
      // fibers. We assume that return pointers never criss-cross, so A must
      // belong to the child set of A.return, and B must belong to the child
      // set of B.return.
      a = parentA;
      b = parentB;
    } else {
      // The return pointers point to the same fiber. We'll have to use the
      // default, slow path: scan the child sets of each parent alternate to see
      // which child belongs to which set.
      //
      // Search parent A's child set
      let didFindChild = false;
      let child = parentA.child;
      while (child) {
        if (child === a) {
          didFindChild = true;
          a = parentA;
          b = parentB;
          break;
        }
        if (child === b) {
          didFindChild = true;
          b = parentA;
          a = parentB;
          break;
        }
        child = child.sibling;
      }
      if (!didFindChild) {
        // Search parent B's child set
        child = parentB.child;
        while (child) {
          if (child === a) {
            didFindChild = true;
            a = parentB;
            b = parentA;
            break;
          }
          if (child === b) {
            didFindChild = true;
            b = parentB;
            a = parentA;
            break;
          }
          child = child.sibling;
        }

        if (!didFindChild) {
          throw new Error(
            'Child was not found in either parent set. This indicates a bug ' +
              'in React related to the return pointer. Please file an issue.'
          );
        }
      }
    }

    if (a.alternate !== b) {
      throw new Error(
        "Return fibers should always be each others' alternates. " +
          'This error is likely caused by a bug in React. Please file an issue.'
      );
    }
  }

  // If the root is not a host container, we're in a disconnected tree. I.e.
  // unmounted.
  if (a.tag !== HostRoot) {
    throw new Error('Unable to find node on an unmounted component.');
  }

  if (a.stateNode.current === a) {
    // We've determined that A is the current branch.
    return fiber;
  }
  // Otherwise B has to be current branch.
  return alternate;
}

function findCurrentHostFiberImpl(node: Fiber): Fiber | null {
  // Next we'll drill down this component to find the first HostComponent/Text.
  const tag = node.tag;
  if (
    tag === HostComponent ||
    tag === HostHoistable ||
    tag === HostSingleton ||
    tag === HostText
  ) {
    return node;
  }

  let child = node.child;
  while (child !== null) {
    const match = findCurrentHostFiberImpl(child);
    if (match !== null) {
      return match;
    }
    child = child.sibling;
  }

  return null;
}

function getNearestMountedFiber(fiber: Fiber): null | Fiber {
  let node = fiber;
  let nearestMounted: null | Fiber = fiber;
  if (!fiber.alternate) {
    // If there is no alternate, this might be a new tree that isn't inserted
    // yet. If it is, then it will have a pending insertion effect on it.
    let nextNode: Fiber = node;
    do {
      node = nextNode;
      if ((node.flags & (Placement | Hydrating)) !== NoFlags) {
        // This is an insertion or in-progress hydration. The nearest possible
        // mounted fiber is the parent but we need to continue to figure out
        // if that one is still mounted.
        nearestMounted = node.return;
      }
      // $FlowFixMe[incompatible-type] we bail out when we get a null
      nextNode = node.return;
    } while (nextNode);
  } else {
    while (node.return) {
      node = node.return;
    }
  }
  if (node.tag === HostRoot) {
    // TODO: Check if this was a nested HostRoot when used with
    // renderContainerIntoSubtree.
    return nearestMounted;
  }
  // If we didn't hit the root, that means that we're in an disconnected tree
  // that has been unmounted.
  return null;
}

function assertIsMounted(fiber: Fiber) {
  if (getNearestMountedFiber(fiber) !== fiber) {
    throw new Error('Unable to find node on an unmounted component.');
  }
}
