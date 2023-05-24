import {Activity} from "./types/fragments/Activity";
import {ExecutionState} from "./types/executionState/ExecutionState";
import {Schedule} from "./types/output/Schedule";
import {Goal} from "./types/goal/Goal";

export class Planner {
    startState: ExecutionState;
    goal: Goal;
    actions: Activity[];

    public constructor(startState: ExecutionState, goal: Goal, actions: Activity[]) {
        this.startState = startState;
        this.goal = goal;
        this.actions = actions;
    }

    public generatePlan(): Schedule {
        this.setUpStartState(this.startState);
        let queue: ExecutionState[] = [this.startState];
        while (queue.length > 0) {
            let node = queue.shift();
            if (this.goal.isFulfilledBy(node!)) {
                return new Schedule(node!.actionHistory, node!.allExecutionDataObjectInstances().map(executionDataObjectInstance =>
                    executionDataObjectInstance.dataObjectInstance), node!.resources
                );
            }
            let newNodes = node!.getSuccessors(this.actions);
            queue.push(...newNodes);
        }
        return new Schedule();
    }

    private setUpStartState(startState: ExecutionState) {
        this.goal.objectives.forEach(() => {
            startState.objectives.push(false);
        });
    }
}