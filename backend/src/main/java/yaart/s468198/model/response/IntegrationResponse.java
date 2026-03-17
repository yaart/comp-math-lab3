package yaart.s468198.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntegrationResponse {
    private Double result;
    private Integer n;
    private Double error;
    private Double exactValue;
    private List<PointDTO> graphPoints;
    private String status;
    private String message;
    private Boolean isImproper;
    private String functionType;
    private String singularityType;
}