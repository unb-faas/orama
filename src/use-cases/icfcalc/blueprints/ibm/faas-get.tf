data "ibm_resource_group" "default" {
  name = var.resource_group
}

resource "ibm_function_namespace" "default" {
  name              = var.namespace
  resource_group_id = data.ibm_resource_group.default.id
}

resource "ibm_function_action" "default-get" {
  name      = "${var.funcname}-get-${random_string.random.result}"
  namespace = ibm_function_namespace.default.name
  publish = true

  exec {
    kind      = "nodejs:12"
    # code_path = var.funcget
    code = file(var.funcget)
    main      = "get"
  }

  limits {
    memory  = var.memory
    timeout = var.timeout
  }

  user_defined_annotations = <<EOF
    [
      {
          "key": "web-export",
          "value": true
      }
    ]
    EOF
      # {
      #     "key": "raw-http",
      #     "value": false
      # },
      # {
      #     "key": "final",
      #     "value": true
      # },
      # {
      #     "key": "require-whisk-auth",
      #     "value": 7819991076995522
      # },
      # {
      #     "key": "exec",
      #     "value": "nodejs:12"
      # }
}
