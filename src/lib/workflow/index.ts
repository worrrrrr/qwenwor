// Workflow Engine System
import type { Workflow, WorkflowStep, WorkflowStatus, StepStatus } from '$lib/types';

class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();
  private activeWorkflows: Set<string> = new Set();

  createWorkflow(name: string, steps: Array<{name: string; agentId: string; action: string; input?: any}>): Workflow {
    const id = `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const workflowSteps: WorkflowStep[] = steps.map((step, index) => ({
      ...step,
      id: `step_${index}_${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending' as StepStatus
    }));

    const workflow: Workflow = {
      id,
      name,
      steps: workflowSteps,
      status: 'pending' as WorkflowStatus,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.workflows.set(id, workflow);
    return workflow;
  }

  async executeWorkflow(workflowId: string): Promise<Workflow> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

    this.activeWorkflows.add(workflowId);
    workflow.status = 'running';
    workflow.updatedAt = new Date();

    for (const step of workflow.steps) {
      if (workflow.status !== 'running') break;

      step.status = 'running';
      
      try {
        await this.executeStep(step);
        step.status = 'completed';
      } catch (error) {
        step.status = 'failed';
        workflow.status = 'failed';
        workflow.updatedAt = new Date();
        this.activeWorkflows.delete(workflowId);
        return workflow;
      }
    }

    if (workflow.status === 'running') {
      workflow.status = 'completed';
    }
    
    workflow.updatedAt = new Date();
    this.activeWorkflows.delete(workflowId);
    return workflow;
  }

  private async executeStep(step: WorkflowStep): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  getActiveWorkflows(): Workflow[] {
    return Array.from(this.activeWorkflows)
      .map(id => this.workflows.get(id))
      .filter((w): w is Workflow => w !== undefined);
  }

  cancelWorkflow(workflowId: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    if (workflow.status === 'running' || workflow.status === 'pending') {
      workflow.status = 'failed';
      workflow.updatedAt = new Date();
      this.activeWorkflows.delete(workflowId);
      
      for (const step of workflow.steps) {
        if (step.status === 'pending') {
          step.status = 'skipped';
        }
      }
      return true;
    }
    return false;
  }

  deleteWorkflow(workflowId: string): boolean {
    this.cancelWorkflow(workflowId);
    return this.workflows.delete(workflowId);
  }
}

export const workflowEngine = new WorkflowEngine();

export function createWorkflow(name: string, steps: Array<{name: string; agentId: string; action: string; input?: any}>): Workflow {
  return workflowEngine.createWorkflow(name, steps);
}

export function executeWorkflow(workflowId: string): Promise<Workflow> {
  return workflowEngine.executeWorkflow(workflowId);
}

export function getWorkflow(id: string): Workflow | undefined {
  return workflowEngine.getWorkflow(id);
}

export function getAllWorkflows(): Workflow[] {
  return workflowEngine.getAllWorkflows();
}

export function getActiveWorkflows(): Workflow[] {
  return workflowEngine.getActiveWorkflows();
}

export function cancelWorkflow(workflowId: string): boolean {
  return workflowEngine.cancelWorkflow(workflowId);
}
