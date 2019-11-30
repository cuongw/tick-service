import express from 'express';
import { celebrate, Joi } from 'celebrate';
import authorize from '../helpers/authorize';
import objectToArray from '../helpers/objectToArray';
import withController from '../helpers/withController';
import controller from '../controllers/task.controller';
import { role, taskStatus, taskPriority, stepStatus } from '../config/constants';

const router = express.Router();

router.post(
  '/',
  authorize(role.free, role.premium),
  celebrate({
    body: {
      // index: Joi.number().integer(),
      title: Joi.string().required(),
      content: Joi.string(),
      status: Joi.string()
        .valid(objectToArray(taskStatus))
        .default(taskStatus.todo),
      priority: Joi.string()
        .valid(objectToArray(taskPriority))
        .default(taskPriority.medium),
      isImportant: Joi.boolean().default(false),
      dueDate: Joi.date().required(),
      reminderDate: Joi.date(),
      doSendMail: Joi.boolean().default(false),
      category: Joi.string().required(),
      steps: Joi.array().items({
        id: Joi.string().guid(),
        // index: Joi.number().integer(),
        title: Joi.string().required(),
        status: Joi.string()
          .valid(objectToArray(stepStatus))
          .default(stepStatus.todo),
      }),
      images: Joi.array().items({
        id: Joi.string().guid(),
        publicId: Joi.string(),
        url: Joi.string().required(),
      }),
    },
  }),
  withController(controller.create),
);

export default router;
