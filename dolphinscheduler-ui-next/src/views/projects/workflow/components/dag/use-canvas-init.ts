/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Node } from '@antv/x6'
import { ref, onMounted, Ref, onUnmounted } from 'vue'
import { Graph } from '@antv/x6'
import { NODE, EDGE, X6_NODE_NAME, X6_EDGE_NAME } from './dag-config'
import { debounce } from 'lodash'

interface Options {
  readonly: Ref<boolean>
  graph: Ref<Graph | undefined>
}

/**
 * Canvas Init
 * 1. Bind the graph to the dom
 * 2. Redraw when the page is resized
 * 3. Register custom graphics
 */
export function useCanvasInit(options: Options) {
  // Whether the graph can be operated
  const { readonly, graph } = options

  const paper = ref<HTMLElement>() // The graph mount HTMLElement
  const minimap = ref<HTMLElement>() // The minimap mount HTMLElement
  const container = ref<HTMLElement>() // The container of paper and minimap

  /**
   * Graph Init, bind graph to the dom
   */
  function graphInit() {
    return new Graph({
      container: paper.value,
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        rubberEdge: true,
        movable: true,
        showNodeSelectionBox: false
      },
      scaling: {
        min: 0.2,
        max: 2
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta']
      },
      scroller: true,
      grid: {
        size: 10,
        visible: true
      },
      snapline: true,
      minimap: {
        enabled: true,
        container: minimap.value,
        scalable: false,
        width: 200,
        height: 120
      },
      interacting: {
        edgeLabelMovable: false,
        nodeMovable: !readonly.value,
        magnetConnectable: !readonly.value
      },
      connecting: {
        // Whether multiple edges can be created between the same start node and end
        allowMulti: false,
        // Whether a point is allowed to connect to a blank position on the canvas
        allowBlank: false,
        // The start node and the end node are the same node
        allowLoop: false,
        // Whether an edge is allowed to link to another edge
        allowEdge: false,
        // Whether edges are allowed to link to nodes
        allowNode: true,
        // Whether to allow edge links to ports
        allowPort: false,
        // Whether all available ports or nodes are highlighted when you drag the edge
        highlight: true,
        createEdge() {
          return graph.value?.createEdge({ shape: X6_EDGE_NAME })
        }
      },
      highlighting: {
        nodeAvailable: {
          name: 'className',
          args: {
            className: 'available'
          }
        },
        magnetAvailable: {
          name: 'className',
          args: {
            className: 'available'
          }
        },
        magnetAdsorbed: {
          name: 'className',
          args: {
            className: 'adsorbed'
          }
        }
      }
    })
  }

  onMounted(() => {
    graph.value = graphInit()
    // Make sure the edge starts with node, not port
    graph.value.on('edge:connected', ({ isNew, edge }) => {
      if (isNew) {
        const sourceNode = edge.getSourceNode() as Node
        edge.setSource(sourceNode)
      }
    })
  })

  /**
   * Redraw when the page is resized
   */
  const paperResize = debounce(() => {
    if (!container.value) return
    const w = container.value.offsetWidth
    const h = container.value.offsetHeight
    graph.value?.resize(w, h)
  }, 200)
  onMounted(() => {
    window.addEventListener('resize', paperResize)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', paperResize)
  })

  /**
   * Register custom cells
   */
  function registerCustomCells() {
    Graph.unregisterNode(X6_NODE_NAME)
    Graph.unregisterEdge(X6_EDGE_NAME)
    Graph.registerNode(X6_NODE_NAME, { ...NODE })
    Graph.registerEdge(X6_EDGE_NAME, { ...EDGE })
  }
  onMounted(() => {
    registerCustomCells()
  })

  return {
    graph,
    paper,
    minimap,
    container
  }
}
