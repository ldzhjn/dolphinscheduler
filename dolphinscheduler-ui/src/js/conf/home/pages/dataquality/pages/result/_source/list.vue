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
<template>
  <div class="list-model">
    <div class="table-box">
      <el-table :data="list" size="mini" style="width: 100%">
        <el-table-column type="index" :label="$t('#')" width="50"></el-table-column>
        <el-table-column prop="taskName" :label="$t('Task Name')"></el-table-column>
        <el-table-column :label="$t('Process Instance')" min-width="200">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.processInstanceName }}</p>
              <div slot="reference" class="name-wrapper">
                <router-link :to="{ path: `/projects/${scope.row.projectCode}/instance/list/${scope.row.processInstanceId}` , query:{code: scope.row.processDefinitionCode}}" tag="a" class="links"><span class="ellipsis">{{ scope.row.processInstanceName }}</span></router-link>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Rule Type')" width="120">
          <template slot-scope="scope">
            {{_rtRuleType(scope.row.ruleType)}}
          </template>
        </el-table-column>
        <el-table-column prop="ruleName" :label="$t('Rule Name')"></el-table-column>
        <el-table-column :label="$t('State')" width="100">
          <template slot-scope="scope">
            {{_rtTaskState(scope.row.state)}}
          </template>
        </el-table-column>
        <el-table-column prop="statisticsValue" :label="$t('Statistics Value')"></el-table-column>
        <el-table-column prop="comparisonValue" :label="$t('Comparison Value')"></el-table-column>
        <el-table-column :label="$t('Check Type')" width="200">
          <template slot-scope="scope">
            {{_rtCheckType(scope.row.checkType)}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Operator')" width="100">
          <template slot-scope="scope">
            {{_rtOperator(scope.row.operator)}}
          </template>
        </el-table-column>
        <el-table-column prop="threshold" :label="$t('Threshold')"></el-table-column>
        <el-table-column :label="$t('Failure Strategy')" width="120">
          <template slot-scope="scope">
            {{_rtFailureStrategy(scope.row.failureStrategy)}}
          </template>
        </el-table-column>
        <el-table-column prop="comparisonTypeName" :label="$t('Comparison Type')"></el-table-column>
        <el-table-column :label="$t('Error Output Path')">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div>{{scope.row.errorOutputPath}}</div>
                <span slot="reference">{{ scope.row.errorOutputPath.substr(0,14)+'...' }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="userName" :label="$t('User Name')"></el-table-column>
        <el-table-column :label="$t('Create Time')" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Update Time')" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | formatDate}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { dataQualityTaskState, checkType, ruleType, operator, failureStrategy } from '@/conf/home/pages/dataquality/_source/common'
  import _ from 'lodash'
  export default {
    name: 'result-list',
    data () {
      return {
        list: []
      }
    },
    props: {
      resultList: Array,
      pageNo: Number,
      pageSize: Number
    },
    methods: {
      _rtTaskState (code) {
        return _.filter(dataQualityTaskState, v => v.code === code)[0].label
      },
      _rtCheckType (code) {
        return _.filter(checkType, v => v.code === code)[0].label
      },
      _rtRuleType (code) {
        return _.filter(ruleType, v => v.code === code)[0].label
      },
      _rtOperator (code) {
        return _.filter(operator, v => v.code === code)[0].label
      },
      _rtFailureStrategy (code) {
        return _.filter(failureStrategy, v => v.code === code)[0].label
      }
    },
    watch: {
      resultList (a) {
        this.list = []
        setTimeout(() => {
          this.list = a
        })
      }
    },
    created () {
      this.list = this.resultList
    },
    mounted () {
    },
    components: { }
  }
</script>
