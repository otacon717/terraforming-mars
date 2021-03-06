import Vue from "vue";
import { Button } from "../components/common/Button";

export const SelectAmount = Vue.component("select-amount", {
    components: {
        "Button": Button
    },
    props: ["playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
            amount: 0,
        };
    },
    methods: {
        saveData: function () {
            this.onsave([[parseInt(this.$data.amount)]]);
        },
        setMaxValue: function () {
            this.$data.amount = this.playerinput.max;
        },
    },
    template: `
    <div>
        <div v-if="showtitle === true">{{playerinput.title}}</div>
        <div class="flex">
            <input type="number" class="nes-input" value="0" min="0" :max="playerinput.max" v-model="amount" />
            <Button size="big" type="max" :onClick="setMaxValue" title="MAX" />
            <Button v-if="showsave === true" size="big" :onClick="saveData" :title="playerinput.buttonLabel" />
        </div>
    </div>`,
});
