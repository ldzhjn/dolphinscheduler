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

import { defineComponent, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import Styles from './dag.module.scss'
import { NTooltip, NIcon, NButton, NSelect } from 'naive-ui'
import {
  SearchOutlined,
  DownloadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  InfoCircleOutlined,
  FormatPainterOutlined
} from '@vicons/antd'
import { useNodeSearch } from './dag-hooks'
import { DataUri } from '@antv/x6'
import { useFullscreen } from '@vueuse/core'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'workflow-dag-toolbar',
  setup(props, context) {
    const { t } = useI18n()
    const graph = inject('graph', ref())
    const router = useRouter()

    /**
     * Node search and navigate
     */
    const {
      searchNode,
      getAllNodes,
      allNodes,
      toggleSearchInput,
      searchInputVisible
    } = useNodeSearch({ graph })

    /**
     * Download Workflow Image
     * @param {string} fileName
     * @param {string} bgColor
     */
    const downloadPNG = (options = { fileName: 'dag', bgColor: '#f2f3f7' }) => {
      const { fileName, bgColor } = options
      graph.value?.toPNG(
        (dataUri: string) => {
          DataUri.downloadDataUri(dataUri, `${fileName}.png`)
        },
        {
          padding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
          },
          backgroundColor: bgColor
        }
      )
    }

    /**
     * Toggle fullscreen
     */
    const { isFullscreen, toggle } = useFullscreen()

    /**
     * Open workflow version modal
     */
    const openVersionModal = () => {
      //TODO, same as the version popup in the workflow list page
    }

    /**
     * Open DAG format modal
     */
    const { openFormatModal } = inject('formatModal', {
      openFormatModal: (bool: boolean) => {}
    })
    const onFormat = () => {
      openFormatModal(true)
    }

    /**
     * Back to the entrance
     */
    const onClose = () => {
      router.go(-1)
    }

    return () => (
      <div class={Styles.toolbar}>
        <span class={Styles['workflow-name']}>
          {t('project.workflow.create_workflow')}
        </span>
        <div class={Styles['toolbar-right-part']}>
          {/* Search node */}
          <NTooltip
            v-slots={{
              trigger: () => (
                <NButton
                  class={Styles['toolbar-right-item']}
                  strong
                  secondary
                  circle
                  type='info'
                  onClick={toggleSearchInput}
                  v-slots={{
                    icon: () => (
                      <NIcon>
                        <SearchOutlined />
                      </NIcon>
                    )
                  }}
                />
              ),
              default: () => t('project.workflow.search')
            }}
          ></NTooltip>
          <div
            class={`${Styles['toolbar-right-item']} ${
              Styles['node-selector']
            } ${searchInputVisible.value ? Styles['visible'] : ''}`}
          >
            <NSelect
              size='small'
              options={allNodes.value}
              onFocus={getAllNodes}
              onUpdateValue={searchNode}
              filterable
            />
          </div>
          {/* Download workflow PNG */}
          <NTooltip
            v-slots={{
              trigger: () => (
                <NButton
                  class={Styles['toolbar-right-item']}
                  strong
                  secondary
                  circle
                  type='info'
                  onClick={() => downloadPNG()}
                  v-slots={{
                    icon: () => (
                      <NIcon>
                        <DownloadOutlined />
                      </NIcon>
                    )
                  }}
                />
              ),
              default: () => t('project.workflow.download_png')
            }}
          ></NTooltip>
          {/* Toggle fullscreen */}
          <NTooltip
            v-slots={{
              trigger: () => (
                <NButton
                  class={Styles['toolbar-right-item']}
                  strong
                  secondary
                  circle
                  type='info'
                  onClick={toggle}
                  v-slots={{
                    icon: () => (
                      <NIcon>
                        {isFullscreen.value ? (
                          <FullscreenExitOutlined />
                        ) : (
                          <FullscreenOutlined />
                        )}
                      </NIcon>
                    )
                  }}
                />
              ),
              default: () =>
                isFullscreen.value
                  ? t('project.workflow.fullscreen_close')
                  : t('project.workflow.fullscreen_open')
            }}
          ></NTooltip>
          {/* DAG Format */}
          <NTooltip
            v-slots={{
              trigger: () => (
                <NButton
                  class={Styles['toolbar-right-item']}
                  strong
                  secondary
                  circle
                  type='info'
                  onClick={onFormat}
                  v-slots={{
                    icon: () => (
                      <NIcon>
                        <FormatPainterOutlined />
                      </NIcon>
                    )
                  }}
                />
              ),
              default: () => t('project.workflow.format')
            }}
          ></NTooltip>
          {/* Version info */}
          <NTooltip
            v-slots={{
              trigger: () => (
                <NButton
                  class={Styles['toolbar-right-item']}
                  strong
                  secondary
                  circle
                  type='info'
                  onClick={openVersionModal}
                  v-slots={{
                    icon: () => (
                      <NIcon>
                        <InfoCircleOutlined />
                      </NIcon>
                    )
                  }}
                />
              ),
              default: () => t('project.workflow.workflow_version')
            }}
          ></NTooltip>
          {/* Save workflow */}
          <NButton
            class={Styles['toolbar-right-item']}
            type='info'
            secondary
            round
          >
            {t('project.workflow.save')}
          </NButton>
          {/* Return to previous page */}
          <NButton secondary round onClick={onClose}>
            {t('project.workflow.close')}
          </NButton>
        </div>
      </div>
    )
  }
})
